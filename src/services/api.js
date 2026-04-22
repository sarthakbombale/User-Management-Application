import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com/users',
  headers: { 'Content-Type': 'application/json' }
});

export const userService = {
  getAll: (limit = 10, skip = 0) => api.get(`?limit=${limit}&skip=${skip}`),
  // ADD THIS LINE:
  search: (query, limit = 10, skip = 0) => api.get(`/search?q=${query}&limit=${limit}&skip=${skip}`),
  getById: (id) => api.get(`/${id}`),
  create: (userData) => api.post('/add', userData),
  update: (id, userData) => api.put(`/${id}`, userData),
  delete: (id) => api.delete(`/${id}`),
};