const Item = require('../models/Item');

const MATCH_CONFIG = {
  categoryWeight: 30,
  locationWeight: 25,
  descriptionWeight: 25,
  dateWeight: 20,
  threshold: 60,
  limit: 5,
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'with', 'and', 'is', 'was', 'near', 'at', 'in', 'on', 'of',
  'to', 'for', 'it', 'this', 'that', 'or', 'but', 'not', 'be', 'are', 'from',
]);

const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const tokenize = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
};

const calculateCategoryScore = (itemCategory, candidateCategory) => {
  if (!itemCategory || !candidateCategory) return 0;
  return itemCategory.toLowerCase() === candidateCategory.toLowerCase()
    ? MATCH_CONFIG.categoryWeight
    : 0;
};

const calculateLocationScore = (itemLocation, candidateLocation) => {
  if (!itemLocation || !candidateLocation) return 0;

  const normalizedA = normalizeText(itemLocation);
  const normalizedB = normalizeText(candidateLocation);

  if (normalizedA === normalizedB) {
    return MATCH_CONFIG.locationWeight;
  }

  const tokensA = new Set(tokenize(itemLocation));
  const tokensB = new Set(tokenize(candidateLocation));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter((t) => tokensB.has(t)));
  const union = new Set([...tokensA, ...tokensB]);

  const jaccardSimilarity = intersection.size / union.size;

  if (jaccardSimilarity >= 0.7) {
    return Math.round(MATCH_CONFIG.locationWeight * 0.9);
  } else if (jaccardSimilarity >= 0.4) {
    return Math.round(MATCH_CONFIG.locationWeight * 0.7);
  } else if (jaccardSimilarity > 0) {
    return Math.round(MATCH_CONFIG.locationWeight * 0.4);
  }

  const partialMatch = [...tokensA].some((token) =>
    [...tokensB].some((bt) => token.includes(bt) || bt.includes(token))
  );

  if (partialMatch) {
    return Math.round(MATCH_CONFIG.locationWeight * 0.3);
  }

  return 0;
};

const calculateDescriptionScore = (itemDescription, candidateDescription) => {
  if (!itemDescription || !candidateDescription) return 0;

  const tokensA = tokenize(itemDescription);
  const tokensB = tokenize(candidateDescription);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = new Set([...setA].filter((t) => setB.has(t)));
  const union = new Set([...setA, ...setB]);

  const jaccardSimilarity = intersection.size / union.size;

  return Math.round(jaccardSimilarity * MATCH_CONFIG.descriptionWeight);
};

const calculateDateScore = (itemDate, candidateDate) => {
  if (!itemDate || !candidateDate) return 0;

  const dateA = new Date(itemDate);
  const dateB = new Date(candidateDate);

  if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;

  const diffTime = Math.abs(dateA - dateB);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return MATCH_CONFIG.dateWeight;
  if (diffDays === 1) return 15;
  if (diffDays === 2) return 10;
  if (diffDays === 3) return 5;
  return 0;
};

const calculateMatchScore = (item, candidate) => {
  const categoryScore = calculateCategoryScore(item.category, candidate.category);
  const locationScore = calculateLocationScore(item.location, candidate.location);
  const descriptionScore = calculateDescriptionScore(item.description, candidate.description);
  const dateScore = calculateDateScore(item.date, candidate.date);

  const totalScore = categoryScore + locationScore + descriptionScore + dateScore;

  return {
    total: Math.min(100, Math.max(0, totalScore)),
    category: categoryScore,
    location: locationScore,
    description: descriptionScore,
    date: dateScore,
  };
};

const getMatchStrength = (score) => {
  if (score >= 90) return 'VERY_STRONG';
  if (score >= 75) return 'STRONG';
  if (score >= 60) return 'POSSIBLE';
  return 'DO_NOT_DISPLAY';
};

const generateReasons = (scores) => {
  const reasons = [];

  if (scores.category === MATCH_CONFIG.categoryWeight) {
    reasons.push('Same category');
  }

  if (scores.location >= MATCH_CONFIG.locationWeight * 0.7) {
    reasons.push('Same location');
  } else if (scores.location >= MATCH_CONFIG.locationWeight * 0.3) {
    reasons.push('Similar location');
  }

  if (scores.description >= MATCH_CONFIG.descriptionWeight * 0.7) {
    reasons.push('Similar description');
  } else if (scores.description > 0) {
    reasons.push('Related description');
  }

  if (scores.date === MATCH_CONFIG.dateWeight) {
    reasons.push('Same date');
  } else if (scores.date >= 10) {
    reasons.push('Close report date');
  }

  return reasons;
};

const findMatches = async (itemId) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error('Item not found');
  }

  const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';

  const candidates = await Item.find({
    type: oppositeType,
    status: 'ACTIVE',
    _id: { $ne: itemId },
  }).select('-verificationAnswer');

  const matches = candidates
    .map((candidate) => {
      const scores = calculateMatchScore(item, candidate);
      const strength = getMatchStrength(scores.total);
      const reasons = generateReasons(scores);

      return {
        item: {
          id: candidate._id,
          title: candidate.title,
          description: candidate.description,
          category: candidate.category,
          type: candidate.type,
          location: candidate.location,
          date: candidate.date,
          image: candidate.image,
          status: candidate.status,
          createdAt: candidate.createdAt,
        },
        score: scores.total,
        strength,
        reasons,
      };
    })
    .filter((match) => match.score >= MATCH_CONFIG.threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, MATCH_CONFIG.limit);

  return {
    item: {
      id: item._id,
      title: item.title,
      type: item.type,
    },
    matches,
  };
};

module.exports = {
  findMatches,
  calculateMatchScore,
  calculateCategoryScore,
  calculateLocationScore,
  calculateDescriptionScore,
  calculateDateScore,
  MATCH_CONFIG,
};