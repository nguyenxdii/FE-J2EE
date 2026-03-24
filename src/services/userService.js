import { authService } from './authService';

const BASE_URL = 'http://localhost:8080/api/users';

export const userService = {
  // 1. Lấy số dư ví từ API thực tế
  getWalletBalance: async () => {
    try {
      // Gọi API thực tế thay vì lấy từ object mock
      const response = await fetch(`${BASE_URL}/balance`);
      
      if (!response.ok) {
        throw new Error('Không thể kết nối với máy chủ');
      }

      const data = await response.json();
      
      // Trả về balance từ JSON { "success": true, "balance": 5000000, ... }
      return data.balance || 0; 
    } catch (error) {
      console.error("Lỗi lấy số dư từ API:", error);
      return 0;
    }
  },

  // 2. Hàm Upload CCCD / GPLX gửi lên Cloudinary
  uploadKYC: async (file) => {
    try {
      // FormData là bắt buộc khi gửi file
      const formData = new FormData();
      formData.append('file', file); // 'file' phải khớp với @RequestParam bên Java

      const response = await fetch(`${BASE_URL}/kyc/upload`, {
        method: 'POST',
        body: formData,
        // LƯU Ý: Không set Content-Type, trình duyệt sẽ tự xử lý cho FormData
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