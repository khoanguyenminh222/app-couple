import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const PROFILE_KEY = 'profile';

export default function SettingsScreen() {
  const [myName, setMyName] = useState('');
  const [myEmail, setMyEmail] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [anniversary, setAnniversary] = useState('2024-01-15');
  const [loading, setLoading] = useState(true);

  const myCode = useMemo(() => {
    if (!myEmail) return '';
    const s = myEmail.trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }
    const base36 = hash.toString(36);
    return base36.padStart(8, '0').slice(0, 8);
  }, [myEmail]);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(PROFILE_KEY);
        if (json) {
          const data = JSON.parse(json);
          setMyName(data.myName || '');
          setMyEmail(data.myEmail || '');
          setPartnerCode(data.partnerCode || '');
          if (data.anniversary) setAnniversary(data.anniversary);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    const data = { myName, myEmail, partnerCode, anniversary };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    Alert.alert('Đã lưu', 'Thông tin của bạn đã được cập nhật.');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.gradients.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <Text style={styles.headerSubtitle}>Thông tin người dùng & ngày kỷ niệm</Text>
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Bạn</Text>
        <Field icon="person" placeholder="Tên của bạn" value={myName} onChangeText={setMyName} />
        <Field icon="mail" placeholder="Email của bạn" value={myEmail} onChangeText={setMyEmail} keyboardType="email-address" />

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Ngày kỷ niệm</Text>
        <Field icon="calendar" placeholder="YYYY-MM-DD" value={anniversary} onChangeText={setAnniversary} />

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Ghép đôi</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Mã của bạn</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeText}>{myCode || 'Nhập email để tạo mã'}</Text>
          </View>
        </View>
        <Field icon="link" placeholder="Nhập mã người ấy" value={partnerCode} onChangeText={setPartnerCode} />

        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={loading}>
          <LinearGradient colors={theme.gradients.primary} style={styles.saveBtnGradient}>
            <Ionicons name="save" size={18} color={theme.colors.white} />
            <Text style={styles.saveBtnText}>Lưu thông tin</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Field({ icon, ...props }) {
  return (
    <View style={styles.fieldRow}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { 
    paddingTop: 40, 
    paddingBottom: 30, 
    paddingHorizontal: theme.spacing.lg 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.white, marginBottom: theme.spacing.xs },
  headerSubtitle: { fontSize: 14, color: theme.colors.white, opacity: 0.9 },
  form: { padding: theme.spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  codeBox: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.lightGray, marginBottom: theme.spacing.sm },
  codeLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeText: { fontSize: 16, color: theme.colors.text, fontWeight: '700' },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.lightGray,
  },
  input: { flex: 1, fontSize: 16, color: theme.colors.text },
  saveBtn: { borderRadius: theme.borderRadius.md, overflow: 'hidden', marginTop: theme.spacing.lg },
  saveBtnGradient: { paddingVertical: theme.spacing.md, alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' },
  saveBtnText: { color: theme.colors.white, fontWeight: '700' },
});


