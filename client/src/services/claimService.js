import api from './api';

export const createClaim = (claimData) => {
  return api.post('/claims', claimData);
};

export const getMyClaims = () => {
  return api.get('/claims/mine');
};

export const getIncomingClaims = () => {
  return api.get('/claims/incoming');
};

export const getItemClaims = (itemId) => {
  return api.get(`/claims/item/${itemId}`);
};

export const approveClaim = (claimId) => {
  return api.patch(`/claims/${claimId}/approve`);
};

export const rejectClaim = (claimId) => {
  return api.patch(`/claims/${claimId}/reject`);
};

export const completeHandover = (claimId, code = '') => {
  return api.patch(`/claims/${claimId}/complete-handover`, { code });
};

export const sendThankYou = (claimId, { note, badge }) => {
  return api.post(`/claims/${claimId}/thank-you`, { note, badge });
};
