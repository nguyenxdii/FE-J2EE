# ShopCar Frontend - Giao diện Web Đặt xe

Phần Frontend của dự án ShopCar được phát triển bằng React và Vite, kết hợp sức mạnh của Vanilla CSS và Tailwind CSS để mang lại trải nghiệm người dùng cao cấp và chuyên nghiệp.

## Hướng dẫn khởi chạy

### Cài đặt và Thiết lập

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   - Sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
   ```
   - Đảm bảo biến `VITE_API_BASE_URL` trỏ chính xác đến Backend API (mặc định: `http://localhost:8080/api`).

3. **Chế độ phát triển**:
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng**:
   - Cổng thông tin khách hàng: `http://localhost:5173`
   - Bảng điều khiển quản trị: `http://localhost:5173/dashboard/admin` (Yêu cầu tài khoản ADMIN)

## Công nghệ sử dụng

- **Framework**: React 18+ (Vite)
- **Định dạng giao diện**: Vanilla CSS, Tailwind CSS, Lucide Icons
- **Kiến trúc UI**: Các thành phần từ Radix UI & Shadcn UI
- **Quản lý trạng thái & Định tuyến**: React Router Dom v6
- **Thông báo**: Sonner (Thông báo dạng Toast)
- **Xử lý thời gian**: Day.js

## Cấu trúc thư mục

```text
src/
├── assets/          # Tài nguyên tĩnh (hình ảnh, font, dữ liệu toàn cục)
├── components/      
│   ├── layout/      # Các thành phần giao diện khung (MainLayout, AdminLayout)
│   ├── shared/      # Các thành phần tái sử dụng (Navbar, Footer, VehicleCard)
│   └── ui/          # Các thành phần UI cơ bản (Button, Input, DropdownMenu)
├── pages/           
│   ├── home/        # Trang chủ và danh sách xe cho khách hàng
│   ├── auth/        # Các trang xác thực (Đăng nhập, Đăng ký, Quên mật khẩu)
│   ├── vehicles/    # Tìm kiếm và chi tiết thông tin xe
│   ├── order/       # Quy trình đặt xe và lịch sử đơn hàng
│   └── admin/       # Các trang quản trị tập trung
├── routes/          # Logic điều hướng và bảo vệ đường dẫn (Route Protection)
├── services/        # Lớp giao tiếp API (Auth, Admin, Vehicle services)
├── styles/          # Cấu hình giao diện và CSS toàn cục
└── utils/           # Các hàm bổ trợ và định dạng dữ liệu
```

## Các tính năng cốt lõi

- **Thiết kế cao cấp**: Giao diện hiện đại với bảng màu nhất quán và các hiệu ứng chuyển động vi mô tinh tế.
- **Phân quyền người dùng**: Hệ thống ProtectedRoute giúp phân tách rõ ràng chức năng Khách hàng và Quản trị viên.
- **Tìm kiếm nâng cao**: Bộ lọc xe thông minh dựa trên thương hiệu, danh mục, giá cả và thông số kỹ thuật.
- **Quản lý đơn hàng**: Kiểm tra tình trạng sẵn sàng của xe theo thời gian thực và hiển thị lịch xe đã đặt.
- **Giao diện đáp ứng (Responsive)**: Tối ưu hóa cho nhiều kích cỡ màn hình khác nhau, đảm bảo trải nghiệm liền mạch trên mọi thiết bị.
