import api from './index';

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to register');
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};