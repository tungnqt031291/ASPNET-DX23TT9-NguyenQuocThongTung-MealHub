# ASPNET-DX23TT9-NguyenQuocThongTung-MealHub

- **Họ tên sinh viên:** Nguyễn Quốc Thông Tùng
- **Mã số sinh viên:** 170123046
- **Lớp:** DX23TT9
- **Email:** tungnqt031291@sv-onuni.edu.vn
- **Số điện thoại:** 0928001710
- **Giảng viên hướng dẫn:** TS. Nguyễn Nhứt Lam
- **Email:** lamnn@tvu.edu.vn

# MealHub - Website Chia Sẻ Công Thức Nấu Ăn


## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0) trở lên
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) (Community Edition)
- [SQL Server 2022](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) hoặc SQL Server LocalDB
- [Git](https://git-scm.com/downloads)
- Tài khoản [Cloudinary](https://cloudinary.com/) (miễn phí)

### Các bước cài đặt

#### Clone repository

```bash
git clone https://github.com/[username]/ASPNET-da21tta-nguyenngocduyen-MealHub.git
cd ASPNET-da21tta-nguyenngocduyen-MealHub
```

#### Mở dự án

Mở file `MealHub.sln` bằng Visual Studio 2022.

#### Cấu hình Database

Cập nhật **Connection String** trong file `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MealHubDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

#### Cấu hình Cloudinary

Đăng ký tài khoản Cloudinary tại [cloudinary.com](https://cloudinary.com/), lấy thông tin và cập nhật vào `appsettings.json`:

```json
"Cloudinary": {
  "CloudName": "your-cloud-name",
  "ApiKey": "your-api-key",
  "ApiSecret": "your-api-secret"
}
```

#### Chạy Migration

Mở **Package Manager Console** (Tools → NuGet Package Manager → Package Manager Console) và chạy:

```powershell
Update-Database
```

Hoặc sử dụng terminal:

```bash
dotnet ef database update
```

#### Build và Run

- Nhấn tổ hợp phím `Ctrl + F5` để chạy ứng dụng không gỡ lỗi
- Hoặc nhấn `F5` để chạy với chế độ gỡ lỗi

> **Lưu ý:** Ứng dụng sẽ chạy mặc định tại `https://localhost:5001` hoặc `http://localhost:5000`

---

## Tài khoản Demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Người dùng** | `demo@mealhub.com` | `P@ssw0rd!23` |
