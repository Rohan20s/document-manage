import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apis.allsoft.co/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const documentAPI = {
  uploadDocument: (formData) => api.post('/documentManagement/saveDocumentEntry', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  searchDocuments: (searchParams) => api.post('/documentManagement/searchDocumentEntry', searchParams),
  getDocumentTags: (term = '') => api.post('/documentManagement/documentTags', { term }),
};

export const authAPI = {
  sendOTP: (phoneNumber) => api.post('/documentManagement/generateOTP', { mobile_number: phoneNumber }),
  verifyOTP: (phoneNumber, otp) => api.post('/documentManagement/validateOTP', { 
    mobile_number: phoneNumber, 
    otp: otp 
  }),
  createUser: (userData) => api.post('/auth/createuser', userData),
};

export default api; 