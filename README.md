# Love Together - Ứng dụng dành cho cặp đôi

## Mô tả
Love Together là một ứng dụng React Native Expo được thiết kế đặc biệt cho các cặp đôi, giúp họ gắn kết, lưu giữ kỷ niệm và quản lý cuộc sống chung một cách dễ dàng và lãng mạn.

## Tính năng chính

### 1. Hồ sơ cặp đôi
- Hiển thị thông tin cá nhân của cả hai người
- Sở thích chung và riêng
- Thống kê tình yêu (số lần hẹn hò, ảnh chung, món quà...)
- Chỉnh sửa thông tin hồ sơ

### 2. Nhật ký / Timeline chung
- Tạo bài viết với hình ảnh và nội dung
- Phân loại bài viết theo loại (kỷ niệm, hẹn hò, quà tặng...)
- Like và comment
- Lưu trữ những khoảnh khắc đẹp

### 3. Lịch hẹn hò & Nhắc nhở
- Calendar view với các sự kiện được đánh dấu
- Thêm sự kiện mới với thông tin chi tiết
- Phân loại sự kiện (hẹn hò, kỷ niệm, mua sắm, du lịch)
- Nhắc nhở thời gian và địa điểm

### 4. Đếm ngày yêu (Love Counter)
- Hiển thị chính xác thời gian bên nhau (ngày, giờ, phút, giây)
- Cột mốc quan trọng (1 tuần, 1 tháng, 100 ngày, 1 năm...)
- Chỉnh sửa ngày bắt đầu yêu nhau
- Thông điệp tình yêu động viên

### 5. Danh sách việc chung (To-do list)
- Tạo task chung với mô tả chi tiết
- Phân công cho từng người hoặc cả hai
- Độ ưu tiên và danh mục
- Theo dõi tiến độ hoàn thành

### 6. Tài chính chung
- Ghi lại các khoản chi tiêu chung
- Phân loại theo danh mục (ẩm thực, giải trí, mua sắm...)
- Theo dõi ai thanh toán
- Thống kê tổng chi tiêu và trung bình/người

### 7. Thư tình / Tin nhắn đặc biệt
- Gửi tin nhắn lãng mạn cho nhau
- Phân loại tin nhắn (thư tình, chào buổi sáng, chúc ngủ ngon...)
- Theo dõi trạng thái đã đọc
- Lưu trữ lịch sử tin nhắn

### 8. Mini Game / Trắc nghiệm
- Quiz tình yêu: Kiểm tra mức độ hiểu nhau
- Truth or Dare: Câu hỏi thật hoặc thử thách
- Đếm ngày yêu: Xem cột mốc đã đạt được
- Trò chơi trí nhớ và kể chuyện tình yêu

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn
- Expo CLI
- Android Studio (để chạy trên Android) hoặc Xcode (để chạy trên iOS)

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng
```bash
npm start
```

### Chạy trên thiết bị
- Cài đặt Expo Go app trên điện thoại
- Quét mã QR từ terminal
- Hoặc chạy `npm run android` / `npm run ios`

## Cấu trúc dự án

```
src/
├── screens/           # Các màn hình chính
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   ├── TimelineScreen.js
│   ├── CalendarScreen.js
│   ├── TodoScreen.js
│   ├── FinanceScreen.js
│   ├── MessagesScreen.js
│   ├── GamesScreen.js
│   └── LoveCounterScreen.js
├── theme/             # Theme và styling
│   └── theme.js
└── components/        # Components tái sử dụng (nếu có)
```

## Công nghệ sử dụng

- **React Native**: Framework chính
- **Expo**: Platform để phát triển và build
- **React Navigation**: Điều hướng giữa các màn hình
- **React Native Paper**: UI components
- **Expo Linear Gradient**: Hiệu ứng gradient
- **React Native Calendars**: Calendar component
- **@expo/vector-icons**: Icon library

## Giao diện

Ứng dụng được thiết kế với giao diện hiện đại, bắt mắt:
- Màu sắc lãng mạn (hồng, đỏ, tím...)
- Gradient backgrounds
- Card design với shadow effects
- Responsive layout
- Smooth animations
- Icon trực quan

## Tính năng tương lai

- [ ] Đồng bộ dữ liệu real-time giữa 2 thiết bị
- [ ] Push notifications cho nhắc nhở
- [ ] Backup và restore dữ liệu
- [ ] Chia sẻ ảnh và video
- [ ] Voice messages
- [ ] Location sharing
- [ ] Budget planning
- [ ] Gift ideas và wishlist

## Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện ứng dụng.

## Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

---

**Lưu ý**: Đây là ứng dụng demo với dữ liệu mẫu. Trong thực tế, bạn cần tích hợp backend và database để lưu trữ dữ liệu thật.
