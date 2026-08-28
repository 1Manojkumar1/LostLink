function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeItem(item, { isOwner = false } = {}) {
  const serialized = {
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
    verificationHint: item.verificationHint || null,
    userId: item.userId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,

    // Item Details
    brand: item.brand || null,
    model: item.model || null,
    color: item.color || null,
    size: item.size || null,
    distinctiveFeatures: item.distinctiveFeatures || null,
    approximateValue: item.approximateValue || null,

    // Date & Time
    lostTime: item.lostTime || null,
    timeApproximate: item.timeApproximate || false,
    lastSeenDate: item.lastSeenDate || null,
    lastSeenTime: item.lastSeenTime || null,

    // Location
    locationDetails: item.locationDetails || null,
    locationType: item.locationType || null,

    // Identification (only visible to owner)
    ...(isOwner ? {
      serialNumber: item.serialNumber || null,
      imei: item.imei || null,
      deviceModel: item.deviceModel || null,
      engraving: item.engraving || null,
      uniqueMarkings: item.uniqueMarkings || null,
      stickers: item.stickers || null,
      otherIdentifiers: item.otherIdentifiers || null,
    } : {}),

    // Photos
    photos: item.photos || [],
    proofDocuments: isOwner ? (item.proofDocuments || []) : undefined,

    // Circumstances
    circumstances: item.circumstances || null,

    // Ownership Proof (private)
    ownershipProof: isOwner ? (item.ownershipProof || null) : undefined,

    // Security Info (private)
    securityInfo: isOwner ? item.securityInfo : undefined,

    // Contact (private)
    ...(isOwner ? {
      contactName: item.contactName || null,
      contactPhone: item.contactPhone || null,
      contactEmail: item.contactEmail || null,
      preferredContact: item.preferredContact || 'in_app',
    } : {}),

    // Privacy (private)
    privacySettings: isOwner ? item.privacySettings : undefined,

    // Notifications (private)
    notifications: isOwner ? item.notifications : undefined,

    // Map coordinates (public only if privacy allows)
    ...(item.latitude != null && item.longitude != null ? {
      latitude: item.latitude,
      longitude: item.longitude,
    } : {}),
  };

  return serialized;
}

function parsePageLimit(page, limit) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit) || 12));
  return { page: p, limit: l };
}

module.exports = { escapeRegex, serializeItem, parsePageLimit };
