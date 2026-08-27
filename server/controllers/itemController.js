const Item = require('../models/Item');
const { findMatches } = require('../services/matchingService');
const { escapeRegex, serializeItem, parsePageLimit } = require('../utils/helpers');

const NEW_FIELDS = [
  'brand', 'model', 'color', 'size', 'distinctiveFeatures', 'approximateValue',
  'lostTime', 'timeApproximate', 'lastSeenDate', 'lastSeenTime',
  'locationDetails', 'locationType', 'latitude', 'longitude',
  'serialNumber', 'imei', 'deviceModel', 'engraving', 'uniqueMarkings', 'stickers', 'otherIdentifiers',
  'photos', 'proofDocuments',
  'circumstances', 'ownershipProof',
  'securityInfo',
  'contactName', 'contactPhone', 'contactEmail', 'preferredContact',
  'privacySettings', 'notifications',
];

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date, image, verificationQuestion, verificationAnswer } = req.body;

    if (!title || !description || !category || !type || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, type, location, and date',
      });
    }

    if (!['LOST', 'FOUND'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be LOST or FOUND',
      });
    }

    if (type === 'FOUND') {
      if (!verificationQuestion || !verificationAnswer) {
        return res.status(400).json({
          success: false,
          message: 'Verification question and answer are required for FOUND items',
        });
      }
    }

    const itemData = {
      title,
      description,
      category,
      type,
      location,
      date,
      image: image || null,
      userId: req.user.userId,
    };

    if (type === 'FOUND') {
      itemData.verificationQuestion = verificationQuestion;
      itemData.verificationAnswer = verificationAnswer;
    }

    NEW_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        itemData[field] = req.body[field];
      }
    });

    if (type === 'LOST') {
      itemData.status = 'ACTIVE';
    }

    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      data: serializeItem(item, { isOwner: true }),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create item',
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { search, type, category, location, date, status, page: rawPage, limit: rawLimit } = req.query;
    const { page, limit } = parsePageLimit(rawPage, rawLimit);

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'ACTIVE';
    }

    if (type && ['LOST', 'FOUND'].includes(type)) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: escapeRegex(location), $options: 'i' };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
        { location: { $regex: safeSearch, $options: 'i' } },
        { brand: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      Item.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email'),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: items.map((item) => serializeItem(item)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
    });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const isOwner = req.user && item.userId._id.toString() === req.user.userId;

    res.status(200).json({
      success: true,
      data: serializeItem(item, { isOwner }),
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item',
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    const { title, description, category, location, date, image, verificationQuestion, verificationAnswer } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (date) item.date = date;
    if (image !== undefined) item.image = image;

    if (item.type === 'FOUND') {
      if (verificationQuestion) item.verificationQuestion = verificationQuestion;
      if (verificationAnswer) item.verificationAnswer = verificationAnswer;
    }

    NEW_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'securityInfo' || field === 'privacySettings' || field === 'notifications') {
          item[field] = { ...item[field], ...req.body[field] };
        } else {
          item[field] = req.body[field];
        }
      }
    });

    await item.save();

    res.status(200).json({
      success: true,
      data: serializeItem(item, { isOwner: true }),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
    });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items.map((item) => serializeItem(item, { isOwner: true })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your items',
    });
  }
};

exports.getItemMatches = async (req, res) => {
  try {
    const result = await findMatches(req.params.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'Item not found') {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to find matches',
    });
  }
};

exports.getMyMatches = async (req, res) => {
  try {
    const myItems = await Item.find({ userId: req.user.userId, status: 'ACTIVE' });

    const matchPromises = myItems.map((item) =>
      findMatches(item._id.toString()).catch(() => ({ matches: [] }))
    );
    const matchResults = await Promise.all(matchPromises);

    const allMatches = [];
    const seen = new Set();

    matchResults.forEach((result, index) => {
      if (result && result.matches) {
        result.matches.forEach((match) => {
          const key = `${match.item.id}-${myItems[index]._id}`;
          if (!seen.has(key)) {
            seen.add(key);
            allMatches.push({ ...match, sourceItem: myItems[index] });
          }
        });
      }
    });

    allMatches.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      data: allMatches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to find matches',
    });
  }
};
