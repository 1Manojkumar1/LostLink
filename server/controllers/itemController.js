const Item = require('../models/Item');
const { findMatches } = require('../services/matchingService');

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

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      image: image || null,
      verificationQuestion: type === 'FOUND' ? verificationQuestion : undefined,
      verificationAnswer: type === 'FOUND' ? verificationAnswer : undefined,
      userId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      data: {
        id: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        type: item.type,
        location: item.location,
        date: item.date,
        image: item.image,
        status: item.status,
        verificationQuestion: item.verificationQuestion,
        userId: item.userId,
        createdAt: item.createdAt,
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
      message: 'Failed to create item',
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { search, type, category, location, date, status, page = 1, limit = 12 } = req.query;

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
      query.location = { $regex: location, $options: 'i' };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, totalItems] = await Promise.all([
      Item.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email'),
      Item.countDocuments(query),
    ]);

    const safeItems = items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: item.image,
      status: item.status,
      verificationQuestion: item.verificationQuestion,
      userId: item.userId,
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: safeItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
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

    res.status(200).json({
      success: true,
      data: {
        id: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        type: item.type,
        location: item.location,
        date: item.date,
        image: item.image,
        status: item.status,
        verificationQuestion: item.verificationQuestion,
        userId: item.userId,
        createdAt: item.createdAt,
      },
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

    const { title, description, category, type, location, date, image, status, verificationQuestion, verificationAnswer } = req.body;

    if (type && !['LOST', 'FOUND'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be LOST or FOUND',
      });
    }

    if (status && !['ACTIVE', 'RESOLVED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be ACTIVE or RESOLVED',
      });
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (type) item.type = type;
    if (location) item.location = location;
    if (date) item.date = date;
    if (image !== undefined) item.image = image;
    if (status) item.status = status;

    if (item.type === 'FOUND') {
      if (verificationQuestion) item.verificationQuestion = verificationQuestion;
      if (verificationAnswer) item.verificationAnswer = verificationAnswer;
    }

    await item.save();

    res.status(200).json({
      success: true,
      data: {
        id: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        type: item.type,
        location: item.location,
        date: item.date,
        image: item.image,
        status: item.status,
        verificationQuestion: item.verificationQuestion,
        userId: item.userId,
        createdAt: item.createdAt,
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
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    const safeItems = items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: item.image,
      status: item.status,
      verificationQuestion: item.verificationQuestion,
      userId: item.userId,
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: safeItems,
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
    if (error.message === 'Item not found') {
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