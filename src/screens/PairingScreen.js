import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export default function PairingScreen() {
  const [partnerCode, setPartnerCode] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  const { createPairingCode, pairWithCode, couple } = useAuth();

  const handlePairing = async () => {
    if (!partnerCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã của đối phương');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await pairWithCode(partnerCode.trim());
      if (result.success) {
        Alert.alert(
          'Thành công!',
          'Bạn đã được ghép đôi với người yêu thành công!',
          [{ text: 'Tiếp tục' }]
        );
      } else {
        Alert.alert('Lỗi', result.error);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCode = async () => {
    if (!anniversaryDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày kỷ niệm');
      return;
    }

    setIsCreatingCode(true);
    
    try {
      const result = await createPairingCode(anniversaryDate);
      if (result.success) {
        Alert.alert(
          'Thành công!',
          `Mã ghép đôi của bạn: ${result.data.pairing_code}\n\nHãy chia sẻ mã này với người yêu để họ có thể ghép đôi với bạn.`,
          [{ text: 'Đã hiểu' }]
        );
      } else {
        Alert.alert('Lỗi', result.error);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsCreatingCode(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Bỏ qua ghép đôi?',
      'Bạn có thể ghép đôi sau trong phần Thông tin. Tuy nhiên, một số chức năng sẽ bị hạn chế.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Bỏ qua', style: 'destructive' },
      ]
    );
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
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={40} color={theme.colors.white} />
            </View>
            <Text style={styles.headerTitle}>Ghép đôi với người yêu</Text>
            <Text style={styles.headerSubtitle}>
              Kết nối để chia sẻ những khoảnh khắc đặc biệt
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Tại sao cần ghép đôi */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Tại sao cần ghép đôi?</Text>
            <Text style={styles.infoText}>
              Ghép đôi giúp bạn và người yêu chia sẻ lịch hẹn, công việc chung và lưu giữ những kỷ niệm đặc biệt. Dữ liệu sẽ được đồng bộ real-time giữa hai người.
            </Text>
          </View>

          {/* Tạo mã ghép đôi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tạo mã ghép đôi</Text>
            <Text style={styles.sectionSubtitle}>
              Nếu bạn là người đầu tiên, hãy tạo mã và chia sẻ với người yêu
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Ngày kỷ niệm (YYYY-MM-DD)"
                value={anniversaryDate}
                onChangeText={setAnniversaryDate}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.createButton, isCreatingCode && styles.buttonDisabled]}
              onPress={handleCreateCode}
              disabled={isCreatingCode}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isCreatingCode ? 'Đang tạo...' : 'Tạo mã ghép đôi'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Hoặc */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>hoặc</Text>
            <View style={styles.orLine} />
          </View>

          {/* Nhập mã ghép đôi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhập mã ghép đôi</Text>
            <Text style={styles.sectionSubtitle}>
              Nếu người yêu đã tạo mã, hãy nhập mã đó để ghép đôi
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mã ghép đôi"
                value={partnerCode}
                onChangeText={setPartnerCode}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={[styles.pairButton, isLoading && styles.buttonDisabled]}
              onPress={handlePairing}
              disabled={isLoading}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Đang ghép đôi...' : 'Ghép đôi'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Help Card */}
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Cần hỗ trợ?</Text>
              <Text style={styles.helpText}>
                Mã ghép đôi có 8 ký tự, bắt đầu bằng "CP". Hãy đảm bảo nhập chính xác mã mà người yêu đã chia sẻ với bạn.
              </Text>
            </View>
          </View>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Bỏ qua, ghép đôi sau</Text>
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
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
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
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  pairButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
