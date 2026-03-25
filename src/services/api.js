const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = {
  request: async (url, method, body = null, options = {}) => {
    const isFormData = body instanceof FormData;
    
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    };

    if (!isFormData && body) {
      headers['Content-Type'] = 'application/json';
    }

    if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type'];
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, { ...config, ...options.fetchOptions });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
            if (e.message.indexOf('HTTP error') !== -1) throw e;
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    if (options.responseType === 'blob') {
      const data = await response.blob();
      return { data };
    }

    const data = await response.json();
    return data;
  },

  get: (url, options = {}) => api.request(url, 'GET', null, options),
  post: (url, body, options = {}) => api.request(url, 'POST', body, options),
  put: (url, body, options = {}) => api.request(url, 'PUT', body, options),
  delete: (url, options = {}) => api.request(url, 'DELETE', null, options),
};

export default api;
