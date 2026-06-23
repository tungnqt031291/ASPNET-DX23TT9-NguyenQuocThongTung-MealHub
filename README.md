# MealHub - Nền tảng chia sẻ công thức nấu ăn (chuyên đề ASP.NET)

## Liên hệ

- **Tác giả:** Nguyễn Quốc Thông Tùng
- **Email:** tungnqt031291@sv-onuni.edu.vn
- **SĐT:** 0928001710

### Yêu cầu hệ thống

| Công cụ | Mô tả | Link tải |
|---------|-------|----------|
| **Docker** | Containerization platform | [Tải về](https://www.docker.com/get-started) |
| **Angular CLI** | Command-line tool cho Angular | [Hướng dẫn](https://angular.io/guide/setup-local) |
| **Visual Studio Code** | Code editor | [Tải về](https://code.visualstudio.com/download) |
| **.NET SDK** | Framework cho backend | [Tải về](https://dotnet.microsoft.com/download/dotnet) |

### Cài đặt

#### Clone repository

```bash
git clone https://github.com/tungnqt031291/ASPNET-DX23TT9-NguyenQuocThongTung-MealHub
cd MealHub
```

#### Khởi tạo Docker container cho MariaDB

```bash
docker-compose up -d
```

#### Cài đặt và chạy Angular frontend

```bash
cd client
npm install
ng serve
```

#### Cài đặt và chạy .NET Web API backend

```bash
cd API
dotnet build
dotnet run
```

#### Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:4200**

### Cấu hình

Trước khi chạy API, bạn cần thiết lập file cấu hình `appsettings.json` để bao gồm thông tin xác thực Cloudinary API và các tùy chọn cấu hình khác.

#### Mở dự án API

```bash
cd API
```

#### Cập nhật file `appsettings.json`

Thêm cấu hình Cloudinary vào file:

```json
"Cloudinary": {
  "CloudName": "tên_cloud_của_bạn",
  "ApiKey": "khóa_api_của_bạn",
  "ApiSecret": "khóa_bí_mật_api_của_bạn"
}
```

> **Lưu ý:** Thay thế `tên_cloud_của_bạn`, `khóa_api_của_bạn` và `khóa_bí_mật_api_của_bạn` bằng thông tin xác thực Cloudinary thực tế của bạn.

#### Cấu hình kết nối Database

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MealHubDB;User=root;Password=yourpassword;"
}
```

### Đăng ký Cloudinary

Nếu chưa có tài khoản Cloudinary:

1. **Truy cập trang web Cloudinary**: [cloudinary.com](https://cloudinary.com/)

2. **Đăng ký**: Nhấp vào nút **"Đăng ký"** hoặc **"Bắt đầu miễn phí"**

3. **Tạo tài khoản**: Điền thông tin cần thiết để tạo tài khoản

4. **Truy cập Bảng điều khiển**: Đăng nhập vào bảng điều khiển Cloudinary

5. **Lấy thông tin xác thực**: Tìm thấy **Cloud Name**, **API Key** và **API Secret** trong dashboard

## Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **Angular** | v16.2.10 | Framework JavaScript mạnh mẽ cho xây dựng SPA |
| **Bootstrap** | v5.3.2 | Framework CSS responsive |
| **Bootswatch** | - | Themes tùy chỉnh cho Bootstrap |
| **ngx-bootstrap** | v11.0.2 | Angular components cho Bootstrap |
| **ng2-file-upload** | v5 | Upload file đơn giản hóa |
| **ngx-infinite-scroll** | v16.0.0 | Cuộn vô hạn cho phân trang |
| **ngx-spinner** | v16.0.2 | Hiển thị loading spinners |
| **ngx-toastr** | v17.0.2 | Hiển thị thông báo toast |
| **Font Awesome** | - | Thư viện biểu tượng vector |

### Backend

| Công nghệ | Mô tả |
|-----------|-------|
| **.NET Web API** | Framework xây dựng RESTful API |
| **SignalR** | Real-time web functionality |
| **JWT** | Xác thực và ủy quyền |
| **Entity Framework Core** | ORM cho thao tác database |

### Database & Services

| Công nghệ | Mô tả |
|-----------|-------|
| **MariaDB** | Hệ quản trị cơ sở dữ liệu |
| **Docker** | Container hóa database |
| **Cloudinary** | Lưu trữ và tối ưu hóa media |
| **Random User API** | Tạo dữ liệu người dùng mẫu |
