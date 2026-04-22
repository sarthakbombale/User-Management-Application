import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com/users',
  headers: { 'Content-Type': 'application/json' }
});

export const userService = {
  getAll: () => api.get('?limit=10'),
  getById: (id) => api.get(`/${id}`),
  create: (userData) => api.post('/add', userData),
  // DummyJSON uses PUT for full updates
  update: (id, userData) => api.put(`/${id}`, userData),
  delete: (id) => api.delete(`/${id}`),
};