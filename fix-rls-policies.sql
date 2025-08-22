-- Fix RLS Policies cho Profiles và Couples
-- Chạy file này trong Supabase SQL Editor

-- Xóa policies cũDEPARTMENT nếu có
DROP POLICY IF EXISTS "Users can insert couple data" ON public.couples;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their couple data" ON public.couples;
DROP POLICY IF EXISTS "Users can update their couple data" ON public.couples;

-- Tạo lại policies với INSERT policy
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert couple data" ON public.couples
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can view their couple data" ON public.couples
  FOR SELECT TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their couple data" ON public.couples
  FOR UPDATE TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Tạo function để tạo profile (bypass RLS)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_nickname TEXT DEFAULT 'User',
  user_birth_date DATE DEFAULT '1995-01-01',
  user_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Kiểm tra xem email đã tồn tại chưa
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = user_email AND id != user_id) THEN
    RAISE EXCEPTION 'Email % already exists for another user', user_email;
  END IF;

  -- Chèn hoặc cập nhật profile
  INSERT INTO public.profiles (id, email, nickname, birth_date, avatar_url)
  VALUES (user_id, user_email, user_nickname, user_birth_date, user_avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nickname = EXCLUDED.nickname,
    birth_date = EXCLUDED.birth_date,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  -- Trả về profile vừa tạo/cập nhật
  SELECT row_to_json(p.*) INTO result
  FROM public.profiles p
  WHERE p.id = user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo function để tạo pairing code (bypass RLS)
CREATE OR REPLACE FUNCTION public.create_pairing_code(
  user_id UUID,
  anniversary_date DATE
)
RETURNS JSON AS $$
DECLARE
  pairing_code TEXT;
  result JSON;
  profile_exists BOOLEAN;
BEGIN
  -- Kiểm tra profile có tồn tại không
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    RAISE EXCEPTION 'Profile not found for user %', user_id;
  END IF;
  
  -- Tạo pairing code
  pairing_code := 'CP' || substr(md5(random()::text), 1, 6);
  
  -- Insert vào bảng couples
  INSERT INTO public.couples (user1_id, pairing_code, anniversary_date)
  VALUES (user_id, pairing_code, anniversary_date);
  
  -- Trả về kết quả
  SELECT row_to_json(c.*) INTO result
  FROM public.couples c
  WHERE c.user1_id = user_id AND c.pairing_code = pairing_code;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo function để tạo pairing code với profile tự động
CREATE OR REPLACE FUNCTION public.create_pairing_code_with_profile(
  user_id UUID,
  user_email TEXT,
  anniversary_date DATE
)
RETURNS JSON AS $$
DECLARE
  new_pairing_code TEXT;
  result JSON;
  profile_exists BOOLEAN;
BEGIN
  -- Kiểm tra profile có tồn tại không
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
  
  -- Nếu chưa có profile, tạo mới
  IF NOT profile_exists THEN
    INSERT INTO public.profiles (id, email, nickname, birth_date, avatar_url)
    VALUES (user_id, user_email, 'User', '1995-01-01', NULL)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Tạo pairing code
  new_pairing_code := 'CP' || substr(md5(random()::text), 1, 6);
  
  -- Insert vào bảng couples
  INSERT INTO public.couples (user1_id, pairing_code, anniversary_date)
  VALUES (user_id, new_pairing_code, anniversary_date);
  
  -- Trả về kết quả
  SELECT row_to_json(c.*) INTO result
  FROM public.couples c
  WHERE c.user1_id = user_id AND c.pairing_code = new_pairing_code;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cấp quyền cho authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_pairing_code(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_pairing_code_with_profile(UUID, TEXT, DATE) TO authenticated;