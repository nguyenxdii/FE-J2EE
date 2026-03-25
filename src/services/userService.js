import { authService } from './authService';

const BASE_URL = 'http://localhost:8080/api/users';

export const userService = {
  // 1. Lấy số dư ví từ API thực tế
  getWalletBalance: async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${BASE_URL}/balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error('Không thể kết nối với máy chủ');
      }

      const data = await response.json();
      return data.balance || 0; 
    } catch (error) {
      console.error("Lỗi lấy số dư từ API:", error);
      return 0;
    }
  },

  // 2. Hàm Upload CCCD / GPLX gửi lên Cloudinary
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

      if (!response.ok) {
        throw new Error('Upload thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi upload KYC:", error);
      return { success: false, message: error.message };
    }
  }
};