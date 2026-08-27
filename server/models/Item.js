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
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Documents/IDs',
        'Wallet/Purse',
        'Keys',
        'Jewelry',
        'Clothing',
        'Bags/Luggage',
        'Books/Stationery',
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
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },

    // Item Details (Section 1)
    brand: {
      type: String,
      trim: true,
      maxlength: [100, 'Brand cannot exceed 100 characters'],
    },
    model: {
      type: String,
      trim: true,
      maxlength: [100, 'Model cannot exceed 100 characters'],
    },
    color: {
      type: String,
      trim: true,
      maxlength: [50, 'Color cannot exceed 50 characters'],
    },
    size: {
      type: String,
      trim: true,
      maxlength: [50, 'Size cannot exceed 50 characters'],
    },
    distinctiveFeatures: {
      type: String,
      trim: true,
      maxlength: [500, 'Distinctive features cannot exceed 500 characters'],
    },
    approximateValue: {
      type: Number,
      min: [0, 'Value cannot be negative'],
    },

    // Date & Time (Section 2)
    lostTime: {
      type: String,
      trim: true,
    },
    timeApproximate: {
      type: Boolean,
      default: false,
    },
    lastSeenDate: {
      type: Date,
    },
    lastSeenTime: {
      type: String,
      trim: true,
    },

    // Location (Section 3)
    locationDetails: {
      type: String,
      trim: true,
      maxlength: [200, 'Location details cannot exceed 200 characters'],
    },
    locationType: {
      type: String,
      enum: ['bus', 'train', 'airport', 'school', 'office', 'restaurant', 'street', 'parking', 'public_transit', 'other', ''],
      default: '',
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    // Identification (Section 4)
    serialNumber: {
      type: String,
      trim: true,
      maxlength: [100, 'Serial number cannot exceed 100 characters'],
    },
    imei: {
      type: String,
      trim: true,
      maxlength: [20, 'IMEI cannot exceed 20 characters'],
    },
    deviceModel: {
      type: String,
      trim: true,
      maxlength: [100, 'Device model cannot exceed 100 characters'],
    },
    engraving: {
      type: String,
      trim: true,
      maxlength: [200, 'Engraving cannot exceed 200 characters'],
    },
    uniqueMarkings: {
      type: String,
      trim: true,
      maxlength: [500, 'Unique markings cannot exceed 500 characters'],
    },
    stickers: {
      type: String,
      trim: true,
      maxlength: [200, 'Stickers cannot exceed 200 characters'],
    },
    otherIdentifiers: {
      type: String,
      trim: true,
      maxlength: [500, 'Other identifiers cannot exceed 500 characters'],
    },

    // Photos & Proof (Section 5)
    image: {
      type: String,
      default: null,
    },
    photos: [{
      type: String,
    }],
    proofDocuments: [{
      type: String,
    }],

    // Circumstances (Section 6)
    circumstances: {
      type: String,
      trim: true,
      maxlength: [2000, 'Circumstances cannot exceed 2000 characters'],
    },

    // Ownership Verification (Section 7)
    ownershipProof: {
      type: String,
      trim: true,
      maxlength: [500, 'Ownership proof cannot exceed 500 characters'],
    },

    // Security Information (Section 8)
    securityInfo: {
      deviceLocked: { type: Boolean, default: false },
      cardBlocked: { type: Boolean, default: false },
      idReported: { type: Boolean, default: false },
      otherMeasures: { type: String, trim: true, maxlength: [500] },
    },

    // Contact (Section 9) - stored privately, never exposed publicly
    contactName: {
      type: String,
      trim: true,
      maxlength: [100],
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: [20],
    },
    contactEmail: {
      type: String,
      trim: true,
      maxlength: [100],
    },
    preferredContact: {
      type: String,
      enum: ['in_app', 'email', 'phone', ''],
      default: 'in_app',
    },

    // Privacy (Section 10)
    privacySettings: {
      showPhone: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showExactLocation: { type: Boolean, default: true },
      showSerialNumber: { type: Boolean, default: false },
      showOwnershipProof: { type: Boolean, default: false },
    },

    // Notifications
    notifications: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    // Status
    status: {
      type: String,
      enum: ['ACTIVE', 'CLAIM_PENDING', 'RESOLVED', 'LOST', 'POTENTIAL_MATCH', 'FOUND', 'CLAIMED', 'RETURNED', 'CLOSED'],
      default: 'ACTIVE',
    },

    // Legacy verification fields for FOUND items
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
