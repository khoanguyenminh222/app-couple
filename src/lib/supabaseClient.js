import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Đọc environment variables
const expoConfig = Constants.expoConfig || {};
const extra = expoConfig.extra || {};

const SUPABASE_URL = extra.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your configuration.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions cho authentication
export const authHelpers = {
  // Đăng ký user mới
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Đăng nhập
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Đăng xuất
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Lấy user hiện tại
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Lắng nghe thay đổi auth state
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Helper functions cho profiles
export const profileHelpers = {
  // Tạo profile cho user mới (sử dụng database function)
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .rpc('create_user_profile', {
        user_id: userId,
        user_email: profileData.email,
        user_nickname: profileData.nickname,
        user_birth_date: profileData.birthDate,
        user_avatar_url: profileData.avatarUrl,
      });
    return { data, error };
  },

  // Lấy profile của user
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Cập nhật profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};

// Helper functions cho pairing
export const pairingHelpers = {
  // Tạo pairing code cho user (sử dụng database function với profile tự động)
  async createPairingCode(userId, anniversaryDate, userEmail = null) {
    const { data, error } = await supabase
      .rpc('create_pairing_code_with_profile', {
        user_id: userId,
        user_email: userEmail || '',
        anniversary_date: anniversaryDate,
      });
    return { data, error };
  },

  // Tìm couple bằng pairing code
  async findCoupleByCode(pairingCode) {
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .eq('pairing_code', pairingCode)
      .eq('is_active', true)
      .single();
    return { data, error };
  },

  // Ghép đôi với user khác
  async pairWithUser(coupleId, user2Id) {
    const { data, error } = await supabase
      .from('couples')
      .update({ user2_id: user2Id })
      .eq('id', coupleId)
      .select()
      .single();
    return { data, error };
  },

  // Lấy thông tin couple của user
  async getCoupleInfo(userId) {
    const { data, error } = await supabase
      .from('couples')
      .select(`
        *,
        user1:profiles!user1_id(*),
        user2:profiles!user2_id(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true)
      .single();
    return { data, error };
  },

  // Hủy ghép đôi
  async unpair(userId) {
    const { data, error } = await supabase
      .from('couples')
      .update({ is_active: false })
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true);
    return { data, error };
  },
};

// Helper functions cho real-time subscriptions
export const realtimeHelpers = {
  // Subscribe to couple data changes
  subscribeToCoupleData(coupleId, callback) {
    return supabase
      .channel(`couple-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${coupleId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to calendar events
  subscribeToCalendarEvents(coupleId, callback) {
    return supabase
      .channel(`calendar-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `couple_id=eq.${coupleId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to todos
  subscribeToTodos(coupleId, callback) {
    return supabase
      .channel(`todos-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `couple_id=eq.${coupleId}`,
        },
        callback
      )
      .subscribe();
  },
};


