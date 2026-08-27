import api from './api';

export const createItem = (itemData) => {
  return api.post('/items', itemData);
};

export const getItems = (params = {}) => {
  return api.get('/items', { params });
};

export const getItemById = (id) => {
  return api.get(`/items/${id}`);
};

export const updateItem = (id, itemData) => {
  return api.put(`/items/${id}`, itemData);
};

export const deleteItem = (id) => {
  return api.delete(`/items/${id}`);
};

export const getMyItems = () => {
  return api.get('/items/mine');
};