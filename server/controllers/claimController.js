const Claim = require('../models/Claim');
const Item = require('../models/Item');

const isAnswerValid = (submitted, expected) => {
  if (!submitted || !expected) return false;
  const cleanSub = submitted.trim().toLowerCase().replace(/[^\w\s]/g, '');
  const cleanExp = expected.trim().toLowerCase().replace(/[^\w\s]/g, '');

  if (cleanSub === cleanExp) return true;
  if (cleanExp.includes(cleanSub) || cleanSub.includes(cleanExp)) return true;

  const subTokens = cleanSub.split(' ').filter((t) => t.length > 1);
  const expTokens = cleanExp.split(' ').filter((t) => t.length > 1);

  if (subTokens.length === 0 || expTokens.length === 0) return false;

  const matches = subTokens.filter((t) => expTokens.some((e) => e.includes(t) || t.includes(e)));
  const matchRatio = matches.length / subTokens.length;
  return matchRatio >= 0.6;
};

exports.createClaim = async (req, res) => {
  try {
    const { itemId, answer } = req.body;

    if (!itemId || !answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and verification answer or handover message are required',
      });
    }

    const item = await Item.findById(itemId).select('+verificationAnswer');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'This item is no longer available for claims',
      });
    }

    if (item.userId.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item',
      });
    }

    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user.userId,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a claim or handover request for this item',
      });
    }

    if (item.type === 'FOUND') {
      if (!item.verificationAnswer) {
        return res.status(400).json({
          success: false,
          message: 'This item does not have a verification question set',
        });
      }

      const isCorrect = isAnswerValid(answer, item.verificationAnswer);

      if (!isCorrect) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect verification answer. Please double check and try again.',
        });
      }
    }

    const claim = await Claim.create({
      itemId,
      claimantId: req.user.userId,
      answer: answer.trim(),
      status: 'PENDING',
    });

    await Item.findByIdAndUpdate(itemId, { status: 'CLAIM_PENDING' });

    res.status(201).json({
      success: true,
      data: {
        id: claim._id,
        itemId: claim.itemId,
        claimantId: claim.claimantId,
        status: claim.status,
        createdAt: claim.createdAt,
      },
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
      message: 'Failed to create claim',
    });
  }
};

exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'itemId',
        select: 'title description category type location date image status',
        populate: { path: 'userId', select: 'name email phone' },
      });

    const safeClaims = claims.map((claim) => ({
      id: claim._id,
      itemId: claim.itemId
        ? {
            id: claim.itemId._id,
            title: claim.itemId.title,
            description: claim.itemId.description,
            category: claim.itemId.category,
            type: claim.itemId.type,
            location: claim.itemId.location,
            date: claim.itemId.date,
            image: claim.itemId.image,
            status: claim.itemId.status,
            userId: claim.itemId.userId,
          }
        : null,
      status: claim.status,
      handoverCode: claim.handoverCode,
      handoverCompletedAt: claim.handoverCompletedAt,
      thankYouNote: claim.thankYouNote,
      karmaBadge: claim.karmaBadge,
      createdAt: claim.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: safeClaims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your claims',
    });
  }
};

exports.getIncomingClaims = async (req, res) => {
  try {
    const myItemIds = await Item.find({ userId: req.user.userId }).distinct('_id');

    const claims = await Claim.find({ itemId: { $in: myItemIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'itemId',
        select: 'title description category type location date image status',
      })
      .populate('claimantId', 'name email phone');

    const safeClaims = claims.map((claim) => ({
      id: claim._id,
      itemId: claim.itemId
        ? {
            id: claim.itemId._id,
            title: claim.itemId.title,
            description: claim.itemId.description,
            category: claim.itemId.category,
            type: claim.itemId.type,
            location: claim.itemId.location,
            date: claim.itemId.date,
            image: claim.itemId.image,
            status: claim.itemId.status,
            userId: claim.itemId.userId,
          }
        : null,
      claimantId: claim.claimantId
        ? {
            id: claim.claimantId._id,
            name: claim.claimantId.name,
            email: claim.claimantId.email,
            phone: claim.claimantId.phone,
          }
        : null,
      status: claim.status,
      handoverCode: claim.handoverCode,
      handoverCompletedAt: claim.handoverCompletedAt,
      thankYouNote: claim.thankYouNote,
      karmaBadge: claim.karmaBadge,
      createdAt: claim.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: safeClaims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incoming claims',
    });
  }
};

exports.getItemClaims = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view claims for this item',
      });
    }

    const claims = await Claim.find({ itemId: req.params.itemId })
      .sort({ createdAt: -1 })
      .populate('claimantId', 'name email phone');

    const safeClaims = claims.map((claim) => ({
      id: claim._id,
      itemId: claim.itemId,
      claimantId: claim.claimantId
        ? {
            id: claim.claimantId._id,
            name: claim.claimantId.name,
            email: claim.claimantId.email,
            phone: claim.claimantId.phone,
          }
        : null,
      status: claim.status,
      handoverCode: claim.handoverCode,
      handoverCompletedAt: claim.handoverCompletedAt,
      thankYouNote: claim.thankYouNote,
      karmaBadge: claim.karmaBadge,
      createdAt: claim.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: safeClaims,
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
      message: 'Failed to fetch claims',
    });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (!claim.itemId) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found',
      });
    }

    if (claim.itemId.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this claim',
      });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only PENDING claims can be approved',
      });
    }

    claim.status = 'APPROVED';
    claim.handoverCode = Math.floor(1000 + Math.random() * 9000).toString();
    await claim.save();

    // Ensure item status remains in CLAIM_PENDING until OTP verification is completed at meetup
    await Item.findByIdAndUpdate(claim.itemId._id, { status: 'CLAIM_PENDING' });

    await Claim.updateMany(
      { itemId: claim.itemId._id, _id: { $ne: claim._id }, status: 'PENDING' },
      { status: 'REJECTED' }
    );

    res.status(200).json({
      success: true,
      data: {
        id: claim._id,
        itemId: claim.itemId._id,
        status: claim.status,
        handoverCode: claim.handoverCode,
        createdAt: claim.createdAt,
      },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to approve claim',
    });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (!claim.itemId) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found',
      });
    }

    if (claim.itemId.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this claim',
      });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only PENDING claims can be rejected',
      });
    }

    claim.status = 'REJECTED';
    await claim.save();

    const hasApproved = await Claim.findOne({
      itemId: claim.itemId._id,
      status: 'APPROVED',
    });

    if (!hasApproved) {
      await Item.findByIdAndUpdate(claim.itemId._id, { status: 'ACTIVE' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: claim._id,
        itemId: claim.itemId._id,
        status: claim.status,
        createdAt: claim.createdAt,
      },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to reject claim',
    });
  }
};

exports.completeHandover = async (req, res) => {
  try {
    const { code } = req.body;
    const claim = await Claim.findById(req.params.id).populate('itemId');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const isOwner = claim.itemId && claim.itemId.userId.toString() === req.user.userId;
    const isClaimant = claim.claimantId.toString() === req.user.userId;

    if (!isOwner && !isClaimant) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this handover' });
    }

    if (claim.status !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Only APPROVED claims can be marked as handed over' });
    }

    if (claim.handoverCode) {
      if (!code || code.toString().trim() !== claim.handoverCode.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Invalid or missing 4-digit handover passcode / OTP' });
      }
    }

    claim.status = 'HANDED_OVER';
    claim.handoverCompletedAt = new Date();
    await claim.save();

    await Item.findByIdAndUpdate(claim.itemId._id, { status: 'RESOLVED' });

    res.status(200).json({
      success: true,
      message: 'Handover successfully completed! Item marked as reunited.',
      data: {
        id: claim._id,
        status: claim.status,
        handoverCompletedAt: claim.handoverCompletedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to complete handover' });
  }
};

exports.sendThankYou = async (req, res) => {
  try {
    const { note, badge } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    if (claim.claimantId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Only the claimant can send a thank you note' });
    }

    if (note) claim.thankYouNote = note.trim();
    if (badge) claim.karmaBadge = badge;
    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Gratitude sent to finder!',
      data: {
        id: claim._id,
        thankYouNote: claim.thankYouNote,
        karmaBadge: claim.karmaBadge,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send thank you note' });
  }
};
