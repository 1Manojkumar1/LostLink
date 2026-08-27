const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Documents',
        'Accessories',
        'Clothing',
        'Bags',
        'Books',
        'Keys',
        'Wallet',
        'Other',
      ],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['LOST', 'FOUND'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'RESOLVED'],
      default: 'ACTIVE',
    },
    verificationQuestion: {
      type: String,
      trim: true,
      maxlength: [200, 'Verification question cannot exceed 200 characters'],
    },
    verificationAnswer: {
      type: String,
      trim: true,
      maxlength: [200, 'Verification answer cannot exceed 200 characters'],
      select: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

ItemSchema.index({ type: 1, status: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ location: 1 });
ItemSchema.index({ date: 1 });
ItemSchema.index({ userId: 1 });
ItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Item', ItemSchema);