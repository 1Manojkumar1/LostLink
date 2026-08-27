const Claim = require('../models/Claim');
const Item = require('../models/Item');

exports.createClaim = async (req, res) => {
  try {
    const { itemId, answer } = req.body;

    if (!itemId || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and verification answer are required',
      });
    }

    const item = await Item.findById(itemId).select('+verificationAnswer');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.type !== 'FOUND') {
      return res.status(400).json({
        success: false,
        message: 'Only FOUND items can be claimed',
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
        message: 'You have already claimed this item',
      });
    }

    if (!item.verificationAnswer) {
      return res.status(400).json({
        success: false,
        message: 'This item does not have a verification question set',
      });
    }

    const isCorrect = answer.trim().toLowerCase() === item.verificationAnswer.trim().toLowerCase();

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect verification answer',
      });
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
        populate: { path: 'userId', select: 'name email' },
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
    const myItemIds = await Item.find({ userId: req.user.userId }).select('_id');

    const claims = await Claim.find({ itemId: { $in: myItemIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'itemId',
        select: 'title description category type location date image status',
      })
      .populate('claimantId', 'name email');

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
          }
        : null,
      status: claim.status,
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
      .populate('claimantId', 'name email');

    const safeClaims = claims.map((claim) => ({
      id: claim._id,
      itemId: claim.itemId,
      claimantId: claim.claimantId
        ? {
            id: claim.claimantId._id,
            name: claim.claimantId.name,
            email: claim.claimantId.email,
          }
        : null,
      status: claim.status,
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
    await claim.save();

    await Item.findByIdAndUpdate(claim.itemId._id, { status: 'RESOLVED' });

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
