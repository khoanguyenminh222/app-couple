-- Database Schema cho Couple App
-- Sử dụng PostgreSQL + Supabase

-- Bảng Users (từ Supabase Auth)
-- CREATE TABLE auth.users (id, email, created_at, ...) - tự động tạo bởi Supabase

-- Bảng Profiles (thông tin chi tiết user)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  birth_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Couples (ghép đôi)
CREATE TABLE couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pairing_code TEXT UNIQUE NOT NULL,
  anniversary_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Bảng Calendar Events
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  event_type TEXT CHECK (event_type IN ('date', 'anniversary', 'shopping', 'travel', 'other')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Todos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  assigned_to TEXT CHECK (assigned_to IN ('user1', 'user2', 'both')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date DATE,
  category TEXT CHECK (category IN ('general', 'travel', 'gift', 'home', 'work', 'other')) DEFAULT 'general',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Couples policies
CREATE POLICY "Users can view their couple data" ON couples
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can insert couple data" ON couples
  FOR INSERT WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can update their couple data" ON couples
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Calendar events policies
CREATE POLICY "Users can view couple events" ON calendar_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = calendar_events.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert couple events" ON calendar_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = calendar_events.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update couple events" ON calendar_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = calendar_events.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

-- Todos policies
CREATE POLICY "Users can view couple todos" ON todos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = todos.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert couple todos" ON todos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = todos.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update couple todos" ON todos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = todos.couple_id 
      AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION generate_pairing_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CP' || substr(md5(random()::text), 1, 6);
END;
$$ LANGUAGE plpgsql;

-- Function để tạo profile (bypass RLS)
CREATE OR REPLACE FUNCTION create_user_profile(
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
  INSERT INTO profiles (id, email, nickname, birth_date, avatar_url)
  VALUES (user_id, user_email, user_nickname, user_birth_date, user_avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nickname = EXCLUDED.nickname,
    birth_date = EXCLUDED.birth_date,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW()
  ON CONFLICT (email) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    birth_date = EXCLUDED.birth_date,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  SELECT row_to_json(p.*) INTO result
  FROM profiles p
  WHERE p.id = user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để tạo pairing code với profile tự động (bypass RLS)
CREATE OR REPLACE FUNCTION create_pairing_code_with_profile(
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
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id) INTO profile_exists;
  
  -- Nếu chưa có profile, tạo mới (sử dụng ON CONFLICT để tránh duplicate)
  IF NOT profile_exists THEN
    INSERT INTO profiles (id, email, nickname, birth_date, avatar_url)
    VALUES (user_id, user_email, 'User', '1995-01-01', NULL)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Tạo pairing code
  new_pairing_code := 'CP' || substr(md5(random()::text), 1, 6);
  
  -- Insert vào bảng couples
  INSERT INTO couples (user1_id, pairing_code, anniversary_date)
  VALUES (user_id, new_pairing_code, anniversary_date);
  
  -- Trả về kết quả (sử dụng alias để tránh ambiguous column)
  SELECT row_to_json(c.*) INTO result
  FROM couples c
  WHERE c.user1_id = user_id AND c.pairing_code = new_pairing_code;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_pairing_code(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION create_pairing_code_with_profile(UUID, TEXT, DATE) TO authenticated;
