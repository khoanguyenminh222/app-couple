import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Đặt trong app.json > expo.extra nếu muốn, tạm thời đọc từ Constants.expoConfig?.extra
const expoConfig = Constants.expoConfig || {};
const extra = expoConfig.extra || {};

const SUPABASE_URL = extra.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});


