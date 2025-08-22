import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { AuthContext } from '../context/AuthContext';

export default function MoreScreen({ navigation }) {
  const { logout, unpair, partner, getMyPairCode } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Trạng thái ghép đôi</Text>
        {partner ? (
          <>
            <Text style={styles.text}>Đang ghép với: {partner.email || partner.code}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Pairing')}>
              <Text style={styles.btnText}>Đổi cặp đôi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => {
              Alert.alert('Hủy ghép đôi', 'Bạn chắc chắn muốn hủy ghép đôi?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đồng ý', style: 'destructive', onPress: unpair },
              ]);
            }}>
              <Text style={styles.btnText}>Hủy ghép đôi</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.text}>Chưa ghép đôi</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Pairing')}>
              <Text style={styles.btnText}>Đi đến ghép đôi</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Mã của bạn</Text>
        <Text style={[styles.text, { fontWeight: '700' }]}>{getMyPairCode()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Tài khoản</Text>
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md, gap: theme.spacing.md },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, ...theme.shadows.medium },
  title: { fontSize: 16, color: theme.colors.text, fontWeight: '700', marginBottom: theme.spacing.sm },
  text: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  btn: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md, paddingVertical: theme.spacing.sm, alignItems: 'center', marginTop: theme.spacing.xs },
  btnDanger: { backgroundColor: theme.colors.error },
  btnText: { color: theme.colors.white, fontWeight: '600' },
});


