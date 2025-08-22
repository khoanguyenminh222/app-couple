import React, { createContext, useContext, useState, useEffect } from 'react';
import { authHelpers, profileHelpers, pairingHelpers } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [couple, setCouple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaired, setIsPaired] = useState(false);

  // Khởi tạo auth state
  useEffect(() => {
    initializeAuth();
    
    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setCouple(null);
          setIsPaired(false);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      const { user: currentUser } = await authHelpers.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.id);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId, profileData = null) => {
    try {
      // Load profile
      const { data: profileDataFromDB, error: profileError } = await profileHelpers.getProfile(userId);
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile không tồn tại, tạo mới
        console.log('Profile not found, creating new profile...');
        const defaultProfileData = profileData || {
          email: user?.email || '',
          nickname: 'User',
          birthDate: '1995-01-01',
          avatarUrl: null,
        };
        
        const { error: createError } = await profileHelpers.createProfile(userId, defaultProfileData);
        
        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          // Load lại profile sau khi tạo
          const { data: newProfileData } = await profileHelpers.getProfile(userId);
          setProfile(newProfileData);
        }
      } else if (profileDataFromDB) {
        setProfile(profileDataFromDB);
      }

      // Load couple info
      const { data: coupleData } = await pairingHelpers.getCoupleInfo(userId);
      if (coupleData) {
        setCouple(coupleData);
        setIsPaired(true);
      } else {
        setCouple(null);
        setIsPaired(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Authentication functions
  const signUp = async (email, password, profileData) => {
    try {
      setLoading(true);
      
      // Đăng ký user
      const { data, error } = await authHelpers.signUp(email, password);
      if (error) throw error;

      // Set user và load data (bao gồm tạo profile nếu cần)
      if (data.user) {
        setUser(data.user);
        await loadUserData(data.user.id, profileData);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authHelpers.signIn(email, password);
      if (error) throw error;

      setUser(data.user);
      await loadUserData(data.user.id);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authHelpers.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setCouple(null);
      setIsPaired(false);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Profile functions
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await profileHelpers.updateProfile(user.id, updates);
      if (error) throw error;

      setProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Pairing functions
  const createPairingCode = async (anniversaryDate) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Tạo pairing code (function sẽ tự động tạo profile nếu cần)
      const { data, error } = await pairingHelpers.createPairingCode(
        user.id,
        anniversaryDate,
        user.email
      );
      if (error) throw error;

      setCouple(data);
      setIsPaired(false); // Chưa ghép đôi hoàn toàn
      return { success: true, data };
    } catch (error) {
      console.error('Create pairing code error:', error);
      return { success: false, error: error.message };
    }
  };

  const pairWithCode = async (pairingCode) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Tìm couple bằng code
      const { data: coupleData, error: findError } = await pairingHelpers.findCoupleByCode(
        pairingCode
      );
      if (findError) throw findError;

      if (!coupleData) {
        throw new Error('Mã ghép đôi không hợp lệ');
      }

      if (coupleData.user1_id === user.id) {
        throw new Error('Không thể ghép đôi với chính mình');
      }

      // Ghép đôi
      const { data, error } = await pairingHelpers.pairWithUser(
        coupleData.id,
        user.id
      );
      if (error) throw error;

      setCouple(data);
      setIsPaired(true);
      return { success: true, data };
    } catch (error) {
      console.error('Pair with code error:', error);
      return { success: false, error: error.message };
    }
  };

  const unpair = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await pairingHelpers.unpair(user.id);
      if (error) throw error;

      setCouple(null);
      setIsPaired(false);
      return { success: true };
    } catch (error) {
      console.error('Unpair error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshCoupleData = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  const value = {
    user,
    profile,
    couple,
    loading,
    isPaired,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createPairingCode,
    pairWithCode,
    unpair,
    refreshCoupleData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
