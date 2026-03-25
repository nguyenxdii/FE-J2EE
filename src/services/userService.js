import { authService } from './authService';
import api from './api';

const BASE_URL = 'http://127.0.0.1:8080/api/users';

export const userService = {
  // 1. Lấy số dư ví
  getWalletBalance: async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`http://127.0.0.1:8080/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error('Không thể kết nối với máy chủ');
      }

      const res = await response.json();
      // Backend trả về: { success: true, message: "...", data: 100000.0 }
      return res.data !== undefined ? res.data : 0; 
    } catch (error) {
      console.error("Lỗi lấy số dư từ API:", error);
      return 0;
    }
  },

  // 2. Upload định danh (CCCD / GPLX) - Gửi lên Backend xử lý Cloudinary
  uploadIdentity: async (files) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      if (files.cccdFront) formData.append('cccdFront', files.cccdFront);
      if (files.cccdBack) formData.append('cccdBack', files.cccdBack);
      if (files.drivingLicense) formData.append('drivingLicense', files.drivingLicense);

      const response = await fetch(`${BASE_URL}/identity`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Lỗi khi tải ảnh lên máy chủ');
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi upload Identity:", error);
      return { success: false, message: error.message };
    }
  },

  // 3. Cập nhật hồ sơ (phương thức cũ dùng upload KYC đơn lẻ, nên giữ lại nếu cần)
  uploadKYC: async (file) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/kyc/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // 4. Lấy thông tin cá nhân
  getProfile: async () => {
    try {
      const res = await api.get('/users/profile');
      return res;
    } catch (error) {
      console.error("Lỗi lấy Profile:", error);
      return { success: false, message: error.message };
    }
  }
};