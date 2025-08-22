import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    myName: 'Nguyễn Văn A',
    myEmail: 'nguyenvana@email.com',
    partnerName: 'Trần Thị B',
    partnerEmail: 'tranthib@email.com',
    anniversary: '2024-01-01',
  });

  const [loveCounter, setLoveCounter] = useState({
    totalDays: 0,
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Tính toán thời gian yêu nhau
    const calculateLoveTime = () => {
      const anniversary = new Date(profileData.anniversary);
      const now = new Date();
      const diff = now - anniversary;

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = totalDays % 30;
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setLoveCounter({ totalDays, years, months, days, hours, minutes, seconds });
    };

    calculateLoveTime();
    const interval = setInterval(calculateLoveTime, 1000);

    return () => clearInterval(interval);
  }, [profileData.anniversary]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header với gradient đẹp */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hồ sơ cặp đôi</Text>
          <Text style={styles.headerSubtitle}>Tình yêu của chúng ta</Text>
          <View style={styles.anniversaryHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.anniversaryHeaderText}>
              Ngày kỷ niệm {formatDate(profileData.anniversary)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Love Counter Card - Ngày tổng */}
        <View style={styles.loveCounterCard}>
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.loveCounterGradient}
          >
            <View style={styles.loveCounterContent}>
              <View style={styles.loveCounterLeft}>
                <Ionicons name="heart" size={28} color={theme.colors.white} />
                <Text style={styles.loveCounterSubtitle}>Đã bên nhau</Text>
              </View>
              <View style={styles.loveCounterCenter}>
                <Ionicons name="sparkles" size={20} color={theme.colors.white} />
              </View>
              <View style={styles.loveCounterRight}>
                <Text style={styles.totalDays}>{loveCounter.totalDays}</Text>
                <Text style={styles.totalDaysLabel}>ngày</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Couple Banner */}
        <View style={styles.coupleBannerCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F8F8']}
            style={styles.coupleBanner}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profileData.myName.charAt(0)}
                </Text>
              </View>
              <View style={styles.heartIcon}>
                <Ionicons name="heart" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profileData.partnerName.charAt(0)}
                </Text>
              </View>
            </View>
            <Text style={styles.coupleNames}>
              {profileData.myName} & {profileData.partnerName}
            </Text>
          </LinearGradient>
        </View>

        {/* Detailed Counter Card */}
        <View style={styles.detailedCounterCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={24} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Thời gian chi tiết</Text>
          </View>
          
          <View style={styles.detailedCounterGrid}>
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.years).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Năm</Text>
            </View>
            
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.secondary }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.months).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Tháng</Text>
            </View>
            
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.love }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.days).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Ngày</Text>
            </View>
            
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.accent }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.hours).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Giờ</Text>
            </View>
            
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.info }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.minutes).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Phút</Text>
            </View>
            
            <View style={styles.counterItem}>
              <View style={[styles.counterBadge, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.counterBadgeValue}>{String(loveCounter.seconds).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.counterBadgeLabel}>Giây</Text>
            </View>
          </View>
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
  header: {
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
  },
  anniversaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  anniversaryHeaderText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  loveCounterCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  loveCounterGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  loveCounterContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  loveCounterLeft: {
    alignItems: 'center',
  },
  loveCounterCenter: {
    alignItems: 'center',
  },
  loveCounterRight: {
    alignItems: 'center',
  },
  loveCounterSubtitle: {
    fontSize: 14,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
  },
  totalDays: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  totalDaysLabel: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
  },
  simpleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.white,
    opacity: 0.95,
    marginBottom: theme.spacing.xs,
  },
  coupleBannerCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  coupleBanner: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  heartIcon: {
    marginHorizontal: theme.spacing.lg,
  },
  coupleNames: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  detailedCounterCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  detailedCounterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  counterItem: {
    width: (width - theme.spacing.md * 4) / 3,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  counterBadge: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  counterBadgeValue: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterBadgeLabel: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
