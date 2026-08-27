import api from './api';

export const getItemMatches = (itemId) => {
  return api.get(`/items/${itemId}/matches`);
};

export const getMyMatches = () => {
  return api.get('/items/my-matches');
};