# BK Tutor - Frontend

Nền tảng kết nối gia sư trực tuyến dành cho sinh viên Đại học Bách Khoa TP.HCM.

## 🚀 Tính năng

### Đã hoàn thành

- ✅ **Xác thực người dùng**

  - Đăng ký tài khoản (Student/Tutor)
  - Đăng nhập
  - Quên mật khẩu (OTP verification)
  - Đổi mật khẩu

- ✅ **Quản lý Gia sư**

  - Danh sách gia sư với tìm kiếm, lọc
  - Chi tiết thông tin gia sư
  - Đăng ký học với gia sư

- ✅ **Lịch học & Sự kiện**

  - Xem lịch theo tháng
  - Danh sách sự kiện sắp tới
  - Đăng ký tham gia sự kiện

- ✅ **Bảng điều khiển**

  - Thống kê hoạt động
  - Lịch học sắp tới
  - Hoạt động gần đây

- ✅ **Hồ sơ cá nhân**

  - Xem và chỉnh sửa thông tin
  - Thống kê cá nhân

- ✅ **Thông báo**

  - Danh sách thông báo
  - Đánh dấu đã đọc

- ✅ **Diễn đàn**

  - Chat theo nhóm môn học
  - Tin nhắn trực tiếp

- ✅ **Chương trình học**
  - Các chương trình đang mở
  - Thông tin chi tiết

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **React Router v7** - Routing
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **date-fns** - Date manipulation

## 📁 Cấu trúc thư mục

```
Frontend/
├── src/
│   ├── api/                 # API services
│   │   ├── axiosClient.ts   # Axios configuration
│   │   ├── authApi.ts       # Authentication API
│   │   ├── mentorApi.ts     # Mentor API
│   │   ├── eventApi.ts      # Event API
│   │   └── ...
│   │
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/             # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── layouts/             # Layout components
│   │   └── MainLayout.tsx
│   │
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MentorsPage.tsx
│   │   ├── MentorDetailPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── ForumPage.tsx
│   │   └── ...
│   │
│   ├── types/               # TypeScript types
│   │   ├── user.ts
│   │   ├── mentor.ts
│   │   ├── event.ts
│   │   └── notification.ts
│   │
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Public assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Cài đặt và Chạy

### Yêu cầu

- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies

```bash
cd Frontend
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🔧 Cấu hình

### API URL

Thay đổi URL của Backend API trong file `src/api/axiosClient.ts`:

```typescript
const axiosClient = axios.create({
  baseURL: "http://localhost:5001/api", // Thay đổi URL tại đây
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 📱 Responsive

Ứng dụng hỗ trợ responsive trên các thiết bị:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Theme Colors

- Primary: `#0056b3`
- Primary Dark: `#003d82`
- Secondary: `#003399`
- Success: `#22c55e`
- Warning: `#f59e0b`
- Danger: `#ef4444`

## 👥 Roles

1. **MENTEE (Student)** - Học viên

   - Tìm kiếm và đăng ký gia sư
   - Xem lịch học
   - Tham gia diễn đàn

2. **MENTOR (Tutor)** - Gia sư

   - Quản lý hồ sơ gia sư
   - Nhận yêu cầu từ học viên
   - Quản lý lịch dạy

3. **ADMIN** - Quản trị viên
   - Quản lý người dùng
   - Quản lý hệ thống

## 📝 License

MIT License - BK Tutor Team 2025
