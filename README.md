# Frontend - Car Booking

Phần Frontend của dự án Car Booking được xây dựng bằng React và Vite.

## 🚀 Hướng dẫn khởi chạy

1. Cài đặt các thư viện phụ thuộc (nếu chưa làm):
   ```bash
   npm install
   ```
3. **Thiết lập Environment**:
   - Sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   - Mở file `.env` và đảm bảo `VITE_API_BASE_URL` trỏ đúng vào cổng của Backend (mặc định là `8080`).

4. Chạy ứng dụng ở chế độ phát triển:
   ```bash
   npm run dev
   ```
5. Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 🛠 Công nghệ sử dụng
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (v3)
- **State Management**: Zustand
- **Routing**: React Router Dom
- **API Client**: Axios
- **Icons**: React Icons

## 📁 Cấu trúc thư mục
- `src/components`: Các thành phần giao diện tái sử dụng.
- `src/pages`: Các trang chính (Home, Login, v.v.).
- `src/services`: Cấu hình Axios và các hàm gọi API.
- `src/store`: Quản lý trạng thái (ví dụ: thông tin người dùng, số dư).
- `src/utils`: Các hàm bổ trợ (format tiền, ngày tháng, v.v.).
