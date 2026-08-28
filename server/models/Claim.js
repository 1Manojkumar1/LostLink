const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claimant ID is required'],
    },
    answer: {
      type: String,
      required: [true, 'Verification answer is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'HANDED_OVER', 'REJECTED'],
      default: 'PENDING',
    },
    handoverCode: {
      type: String,
      trim: true,
    },
    handoverCompletedAt: {
      type: Date,
    },
    thankYouNote: {
      type: String,
      trim: true,
      maxlength: [300, 'Thank you note cannot exceed 300 characters'],
    },
    karmaBadge: {
      type: String,
      trim: true,
      default: 'Campus Good Samaritan',
    },
  },
  {
    timestamps: true,
  }
);

ClaimSchema.index({ itemId: 1 });
ClaimSchema.index({ claimantId: 1 });
ClaimSchema.index({ itemId: 1, claimantId: 1 }, { unique: true });

module.exports = mongoose.model('Claim', ClaimSchema);
