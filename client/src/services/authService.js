import api from './api';

export const register = (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getMe = () => {
  return api.get('/auth/me');
};