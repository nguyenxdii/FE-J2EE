const BASE_URL = 'http://127.0.0.1:8080/api';

export const authService = {
  // --- ĐĂNG NHẬP / ĐĂNG KÝ ---
  
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        return { success: true, user: result.data.user };
      } else {
        return { success: false, message: result.message || 'Đăng nhập thất bại' };
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Lỗi kết nối đến máy chủ' };
    }
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Đăng ký bước 1: Gửi OTP
  sendOtp: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Đăng ký bước 2: Xác minh OTP
  verifyOtp: async (userData, otp) => {
    const response = await fetch(`${BASE_URL}/auth/register/verify-otp?otp=${otp}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    return result;
  },

  // Đăng nhập Google
  googleLogin: async (idToken) => {
    const response = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user)); // Sửa: chỉ lưu result.data.user
    }
    return result;
  },

  // --- QUÊN MẬT KHẨU ---

  forgotPassword: async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  resetPassword: async (data) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // --- HỒ SƠ & MẬT KHẨU ---

  getProfile: async () => {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  updateProfile: async (data, avatarFile) => {
    const token = authService.getToken();
    const formData = new FormData();
    if (data) formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (avatarFile) formData.append('avatar', avatarFile);

    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
      // Cập nhật lại user trong localStorage
      const currentUser = authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.data }));
    }
    return result;
  },

  changePassword: async (oldPassword, newPassword) => {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response.json();
  },

  // --- HELPER ---

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  }
};
