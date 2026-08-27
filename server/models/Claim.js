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
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
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
