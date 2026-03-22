# Frontend - ShopCar (Hệ thống đặt xe)

Phần Frontend của dự án ShopCar được xây dựng bằng React và Vite, kết hợp với Tailwind CSS mang lại giao diện hiện đại, chuyên nghiệp cùng trải nghiệm người dùng tối ưu.

## 🚀 Hướng dẫn khởi chạy

1. **Cài đặt các thư viện phụ thuộc**:
   ```bash
   npm install
   ```
2. **Thiết lập Environment**:
   - Sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   - Đảm bảo `VITE_API_BASE_URL` trỏ đúng vào cổng của Backend (mặc định là `http://localhost:8080/api`).

3. **Chạy ứng dụng ở chế độ phát triển**:
   ```bash
   npm run dev
   ```
4. **Truy cập ứng dụng**:
   - Trang chủ: `http://localhost:5173`
   - Dashboard Admin: `http://localhost:5173/dashboard/admin` (Yêu cầu đăng nhập tài khoản ADMIN)

## 🛠 Công nghệ sử dụng

- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **UI Components**: Radix UI (Avatar, Dropdown, AlertDialog) & Shadcn UI architecture
- **Xác thực**: JWT (Lưu trữ an toàn trong LocalStorage)
- **Routing**: React Router Dom v6 (Hỗ trợ Protected Routes)
- **Thông báo**: Sonner (Toast notifications)

## 📁 Cấu trúc thư mục (src)

```text
src/
├── assets/          # Tài nguyên tĩnh (Hình ảnh, Logo)
├── components/      
│   ├── layout/      # Layout chính (MainLayout) và Layout quản trị (AdminLayout)
│   ├── shared/      # Các linh kiện tái sử dụng: Navbar, Footer, VehicleCard
│   └── ui/          # Các UI cơ bản: Button, Input, DropdownMenu, Avatar, AlertDialog
├── pages/           
│   ├── home/        # Giao diện khách hàng (Tìm kiếm, danh sách xe)
│   ├── auth/        # Trang Đăng nhập (LoginPage) và Đăng ký (RegisterPage)
│   └── admin/       # Khu vực quản trị (Dashboard, Quản lý xe/đơn hàng)
├── routes/          # Cấu hình định tuyến và ProtectedRoute
├── services/        # Tương tác API (authService, vehicleService)
├── styles/          # Tailwind config và Global CSS
└── utils/           # Tiện ích bổ trợ (API client, formatters)
```

## ✨ Tính năng nổi bật

- **Giao diện đẳng cấp**: Thiết kế Premium với hệ màu đen/trắng tinh tế, hiệu ứng chuyển động mượt mà.
- **Tài khoản & Phân quyền**: Luồng đăng nhập/đăng ký hoàn chỉnh, Menu Avatar thông minh với tính năng đăng xuất an toàn.
- **Bảo mật đường dẫn**: Sử dụng `ProtectedRoute` để ngăn chặn khách hàng truy cập trái phép vào trang quản trị.
- **Tìm kiếm thông minh**: Bộ lọc xe đa dạng (Hãng, Giá, Năm, Hộp số, Nhiên liệu).
- **Thông báo trực quan**: Hệ thống Toast thông báo trạng thái đăng nhập, lỗi hoặc thành công theo thời gian thực.
