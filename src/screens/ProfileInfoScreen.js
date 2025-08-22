import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '../theme/theme';

export default function ProfileInfoScreen({ navigation }) {
  const [isPaired, setIsPaired] = useState(true);

  // Animation states
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Liên hệ hỗ trợ',
      'Email: support@coupleapp.com\nHotline: 1900-xxxx',
      [
        { text: 'Gửi email', onPress: () => Linking.openURL('mailto:support@coupleapp.com') },
        { text: 'Gọi điện', onPress: () => Linking.openURL('tel:1900xxxx') },
        { text: 'Đóng', style: 'cancel' },
      ]
    );
  };

  const handleSuggestQuestion = () => {
    Alert.alert(
      'Đề xuất câu hỏi',
      'Gửi câu hỏi của bạn đến: questions@coupleapp.com',
      [
        { text: 'Gửi email', onPress: () => Linking.openURL('mailto:questions@coupleapp.com') },
        { text: 'Đóng', style: 'cancel' },
      ]
    );
  };

  const handleSocialMedia = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/coupleapp',
      instagram: 'https://instagram.com/coupleapp',
      youtube: 'https://youtube.com/coupleapp',
    };
    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  const renderProfileHeader = () => (
    <Animated.View style={[styles.headerCard, animatedStyle]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleEditProfile}
        activeOpacity={1}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.headerGradient}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.profileTextContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.myName}>A lu</Text>
                <View style={styles.heartPill}>
                  <Ionicons name="heart" size={16} color={theme.colors.white} />
                </View>
                <Text style={styles.partnerName}>Công chúa</Text>
              </View>
              <Text style={styles.daysTogether}>Đã bên nhau 365 ngày</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.white} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🆘 Hỗ trợ khách hàng</Text>
      <View style={styles.menuItem}>
        <TouchableOpacity style={styles.menuItemInner} activeOpacity={0.8}>
          <View style={styles.menuIcon}>
            <Ionicons name="help-circle" size={24} color={theme.colors.info} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Câu hỏi thường gặp</Text>
            <Text style={styles.menuSubtitle}>Tìm câu trả lời nhanh</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuItem}>
        <TouchableOpacity style={styles.menuItemInner} onPress={handleContactSupport} activeOpacity={0.8}>
          <View style={styles.menuIcon}>
            <Ionicons name="call" size={24} color={theme.colors.success} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Liên hệ hỗ trợ</Text>
            <Text style={styles.menuSubtitle}>Email, hotline hỗ trợ</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOtherSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔗 Khác</Text>
      {['facebook', 'instagram', 'youtube'].map((platform) => (
        <View key={platform} style={styles.menuItem}>
          <TouchableOpacity style={styles.menuItemInner} onPress={() => handleSocialMedia(platform)} activeOpacity={0.8}>
            <View style={styles.menuIcon}>
              <Ionicons
                name={`logo-${platform}`}
                size={24}
                color={
                  platform === 'facebook' ? '#1877F2' :
                  platform === 'instagram' ? '#E4405F' : '#FF0000'
                }
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
              <Text style={styles.menuSubtitle}>
                {platform === 'facebook' ? 'Theo dõi chúng tôi' :
                 platform === 'instagram' ? 'Cập nhật mới nhất' : 'Video hướng dẫn'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.menuItem}>
        <TouchableOpacity style={styles.menuItemInner} onPress={handleSuggestQuestion} activeOpacity={0.8}>
          <View style={styles.menuIcon}>
            <Ionicons name="bulb" size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Đề xuất câu hỏi</Text>
            <Text style={styles.menuSubtitle}>Gửi câu hỏi mới</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderSupportSection()}
        {renderOtherSection()}
        <View style={styles.footer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.footerGradient}
          >
            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
            <Text style={styles.copyrightText}>© 2025 Couple App. All rights reserved.</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  headerCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  headerGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileTextContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  myName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.white,
    fontFamily: 'System',
  },
  partnerName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.white,
  },
  heartPill: {
    marginHorizontal: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysTogether: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
    opacity: 1,
    fontFamily: 'System',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: 'System',
  },
  menuItem: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'System',
  },
  menuSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'System',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  footerGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    width: '100%',
  },
  versionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontFamily: 'System',
  },
  copyrightText: {
    fontSize: 12,
    color: theme.colors.gray,
    fontFamily: 'System',
  },
});