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

export default function PairingScreen({ navigation }) {
  const [partnerCode, setPartnerCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePairing = async () => {
    if (!partnerCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã của đối phương');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Gọi API để xác thực mã và ghép đôi
      // const response = await supabaseClient
      //   .from('pairs')
      //   .select('*')
      //   .eq('code', partnerCode.trim())
      //   .single();

      // Giả lập xử lý ghép đôi thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Thành công!',
        'Bạn đã được ghép đôi với người yêu thành công!',
        [
          {
            text: 'Tiếp tục',
            onPress: () => navigation.navigate('Main'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Mã không hợp lệ hoặc đã được sử dụng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Bỏ qua ghép đôi?',
      'Bạn có thể ghép đôi sau trong phần Cài đặt. Tuy nhiên, một số chức năng sẽ bị hạn chế.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Bỏ qua',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={48} color={theme.colors.white} />
            </View>
            <Text style={styles.headerTitle}>Ghép đôi với người yêu</Text>
            <Text style={styles.headerSubtitle}>
              Nhập mã để kết nối và sử dụng tất cả chức năng
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.infoTitle}>Tại sao cần ghép đôi?</Text>
            </View>
            <Text style={styles.infoText}>
              Ghép đôi để kết nối với người yêu và sử dụng tất cả tính năng. Chia sẻ lịch hẹn hò, quản lý việc chung và đồng bộ thông tin. Một số chức năng sẽ không khả dụng khi chưa ghép đôi.
            </Text>
          </View>

          <View style={styles.pairingCard}>
            <Text style={styles.pairingTitle}>Nhập mã của đối phương</Text>
            <Text style={styles.pairingSubtitle}>
              Hãy xin mã từ người yêu của bạn
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                value={partnerCode}
                onChangeText={setPartnerCode}
                placeholder="Nhập mã"
                placeholderTextColor={theme.colors.gray}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={styles.pairButton} 
              onPress={handlePairing}
              disabled={isLoading}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.pairButtonGradient}
              >
                <Ionicons 
                  name={isLoading ? "hourglass" : "heart"} 
                  size={20} 
                  color={theme.colors.white} 
                />
                <Text style={styles.pairButtonText}>
                  {isLoading ? 'Đang ghép đôi...' : 'Ghép đôi ngay'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Để sau, tôi sẽ ghép đôi sau</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <Ionicons name="help-circle" size={20} color={theme.colors.info} />
              <Text style={styles.helpTitle}>Cần hỗ trợ?</Text>
            </View>
            <Text style={styles.helpText}>
              Nếu chưa có mã, hãy xin từ người yêu hoặc tạo mới trong Cài đặt. Ghép đôi thành công sẽ có thông báo xác nhận.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
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
    padding: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  benefitsList: {
    gap: theme.spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  pairingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  pairingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  pairingSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  pairButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  pairButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  pairButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
