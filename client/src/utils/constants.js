export const CATEGORIES = [
  'Electronics',
  'Documents/IDs',
  'Wallet/Purse',
  'Keys',
  'Jewelry',
  'Clothing',
  'Bags/Luggage',
  'Books/Stationery',
  'Other',
];

export const ITEM_TYPES = ['LOST', 'FOUND'];

export const ITEM_STATUSES = ['ACTIVE', 'CLAIM_PENDING', 'RESOLVED', 'LOST', 'POTENTIAL_MATCH', 'FOUND', 'CLAIMED', 'RETURNED', 'CLOSED'];

export const CLAIM_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

export const LOCATION_TYPES = [
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'airport', label: 'Airport' },
  { value: 'school', label: 'School/Campus' },
  { value: 'office', label: 'Office' },
  { value: 'restaurant', label: 'Restaurant/Cafe' },
  { value: 'street', label: 'Street/Road' },
  { value: 'parking', label: 'Parking' },
  { value: 'public_transit', label: 'Public Transit' },
  { value: 'other', label: 'Other' },
];

export const CONTACT_METHODS = [
  { value: 'in_app', label: 'In-App Notification' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Call/SMS' },
];

export const SECURITY_CATEGORIES = {
  Electronics: ['deviceLocked'],
  'Wallet/Purse': ['cardBlocked'],
  'Documents/IDs': ['idReported'],
  Keys: [],
};

export const REPORT_STEPS = [
  { id: 1, label: 'Item Details' },
  { id: 2, label: 'Date & Time' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Identification' },
  { id: 5, label: 'Photos & Proof' },
  { id: 6, label: 'Circumstances' },
  { id: 7, label: 'Verification' },
  { id: 8, label: 'Contact' },
  { id: 9, label: 'Privacy' },
  { id: 10, label: 'Review' },
];
