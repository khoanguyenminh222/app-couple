import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (!isLogin && !nickname.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập biệt danh');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn(email.trim(), password);
        if (!result.success) {
          Alert.alert('Lỗi đăng nhập', result.error);
        }
      } else {
        const profileData = {
          email: email.trim(),
          nickname: nickname.trim(),
          birthDate: '1995-01-01', // Default value
          avatarUrl: null,
        };
        
        const result = await signUp(email.trim(), password, profileData);
        if (!result.success) {
          Alert.alert('Lỗi đăng ký', result.error);
        } else {
          Alert.alert('Thành công', 'Tài khoản đã được tạo! Vui lòng kiểm tra email để xác thực.');
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="heart" size={40} color={theme.colors.white} />
            </View>
            <Text style={styles.appName}>Love Together</Text>
            <Text style={styles.appSubtitle}>Ứng dụng dành cho cặp đôi</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Biệt danh"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>
                {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
