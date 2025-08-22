# Hướng dẫn Setup Backend với Supabase

## 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký/đăng nhập tài khoản
3. Click "New Project"
4. Điền thông tin:
   - **Name**: `love-together-app`
   - **Database Password**: Tạo password mạnh
   - **Region**: Chọn region gần nhất (Singapore hoặc Tokyo)
5. Click "Create new project"
6. Đợi project được tạo (khoảng 2-3 phút)

## 2. Lấy Credentials

1. Vào **Settings** > **API**
2. Copy các thông tin:
   - **Project URL**: `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Cấu hình Environment Variables

### Cách 1: Sử dụng app.json (Khuyến nghị cho development)

Cập nhật file `app.json`:

```json
{
  "expo": {
    "extra": {
      "SUPABASE_URL": "https://your-project-url.supabase.co",
      "SUPABASE_ANON_KEY": "your-anon-key-here"
    }
  }
}
```

### Cách 2: Sử dụng .env file

1. Tạo file `.env` trong root directory:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Thêm `.env` vào `.gitignore`:
```gitignore
.env
```

## 4. Setup Database Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy toàn bộ nội dung từ file `database-schema.sql`
3. Paste vào SQL Editor và click "Run"

## 5. Cấu hình Authentication

1. Vào **Authentication** > **Settings**
2. Cấu hình:
   - **Site URL**: `exp://localhost:8081` (cho development)
   - **Redirect URLs**: 
     - `exp://localhost:8081`
     - `exp://192.168.1.100:8081` (IP của máy)
     - `love-together://` (cho production)

## 6. Cấu hình Storage (cho avatars)

1. Vào **Storage** > **Create a new bucket**
2. Tạo bucket tên `avatars`
3. Cấu hình RLS policies:

```sql
-- Cho phép user upload avatar của mình
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Cho phép user xem avatar của mình
CREATE POLICY "Users can view own avatar" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Cho phép user update avatar của mình
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Cho phép user delete avatar của mình
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 7. Test Setup

1. Chạy app:
```bash
npm start
```

2. Thử đăng ký tài khoản mới
3. Kiểm tra trong Supabase Dashboard:
   - **Authentication** > **Users**: Có user mới
   - **Table Editor** > **profiles**: Có profile mới

## 8. Troubleshooting

### Lỗi "Missing Supabase environment variables"
- Kiểm tra lại URL và Key trong app.json hoặc .env
- Restart Expo development server

### Lỗi "Invalid API key"
- Kiểm tra lại anon key
- Đảm bảo project đã được tạo thành công

### Lỗi "RLS policy violation"
- Kiểm tra RLS policies đã được tạo đúng
- Đảm bảo user đã đăng nhập

### Lỗi "Function not found"
- Kiểm tra function `generate_pairing_code` đã được tạo
- Chạy lại SQL schema

## 9. Production Setup

Khi deploy production:

1. Cập nhật **Site URL** và **Redirect URLs** trong Authentication settings
2. Sử dụng environment variables thay vì hardcode
3. Cấu hình custom domain (nếu cần)
4. Setup monitoring và logging

## 10. Security Best Practices

1. **Never commit credentials** vào git
2. **Use RLS policies** để bảo vệ dữ liệu
3. **Validate input** ở client và server
4. **Use HTTPS** cho production
5. **Regular security audits** của database
