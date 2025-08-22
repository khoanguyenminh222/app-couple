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

export default function EditProfileScreen({ navigation }) {
  const [myInfo, setMyInfo] = useState({
    name: 'Bạn',
    email: 'user@example.com',
    birthDate: '1995-01-01',
    nickname: 'A lu',
    avatar: null,
  });

  const [partnerInfo, setPartnerInfo] = useState({
    name: 'Người yêu',
    email: 'partner@example.com',
    birthDate: '1996-05-15',
    nickname: 'Công chúa',
    avatar: null,
  });

  const [anniversaryDate, setAnniversaryDate] = useState('2024-01-15');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');

  const calculateDaysTogether = () => {
    const anniversary = new Date(anniversaryDate);
    const today = new Date();
    const diffTime = Math.abs(today - anniversary);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingField === 'nickname') {
      setMyInfo({ ...myInfo, nickname: editValue });
    } else if (editingField === 'birthDate') {
      setMyInfo({ ...myInfo, birthDate: editValue });
    }
    setShowEditModal(false);
  };

  const handleOptionSelect = (option) => {
    if (option === 'nickname') {
      setEditingField('nickname');
      setEditValue(myInfo.nickname);
    } else if (option === 'birthDate') {
      setEditingField('birthDate');
      setEditValue(myInfo.birthDate);
    } else if (option === 'avatar') {
      // TODO: Implement avatar picker
      setShowEditModal(false);
    }
  };

  const handleSave = () => {
    Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
    navigation.goBack();
  };

  const handleUnpair = () => {
    Alert.alert(
      'Hủy ghép đôi',
      'Bạn có chắc muốn hủy ghép đôi với người yêu? Hành động này sẽ ngắt kết nối và mất dữ liệu chung.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thành công', 'Đã hủy ghép đôi');
            navigation.goBack();
          }
        },
      ]
    );
  };

  const renderMyProfileSection = () => (
    <View style={styles.section}>
      {renderProfileSection(myInfo, true)}
      {renderProfileSection(partnerInfo, false)}
    </View>
  );

  const renderProfileSection = (info, isEditable) => (
    <View style={styles.profileContainer}>
      <View style={styles.profileLabel}>
        <Text style={styles.profileLabelText}>
          {isEditable ? '👤 Bạn' : '💕 Người yêu'}
        </Text>
      </View>
      <View style={styles.previewRow}>
        <TouchableOpacity 
          style={[styles.previewAvatar, isEditable ? styles.myAvatar : styles.partnerAvatar]} 
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={28} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.previewMiddle}>
          <Text style={[styles.previewNickname, isEditable ? styles.myNickname : styles.partnerNickname]}>{info.nickname}</Text>
          <View style={styles.previewSubRow}>
            <Ionicons name="calendar" size={14} color={theme.colors.primary} />
            <Text style={styles.previewBirth}>{info.birthDate}</Text>
          </View>
        </View>
        {isEditable ? (
          <TouchableOpacity
            style={styles.previewEditBtn}
            onPress={() => {
              setShowEditModal(true);
              setEditingField('options');
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="create" size={16} color={theme.colors.white} />
            <Text style={styles.previewEditText}>Sửa</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewEditBtnDisabled}>
            <Ionicons name="eye" size={16} color={theme.colors.gray} />
            <Text style={styles.previewEditTextDisabled}>Xem</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderAnniversarySection = () => (
    <View style={styles.section}>
      <View style={styles.profileContainer}>
        <View style={styles.profileLabel}>
          <Text style={styles.profileLabelText}>💝 Ngày kỷ niệm</Text>
        </View>
        <TouchableOpacity
          style={styles.previewRow}
          onPress={() => handleEditField('anniversary', anniversaryDate)}
          activeOpacity={0.8}
        >
          <View style={styles.previewMiddle}>
            <Text style={styles.previewNickname}>{anniversaryDate}</Text>
            <View style={styles.previewSubRow}>
              <Ionicons name="calendar" size={14} color={theme.colors.primary} />
              <Text style={styles.previewBirth}>Đã bên nhau {calculateDaysTogether()} ngày</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderMyProfileSection()}
        {renderAnniversarySection()}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="save" size={20} color={theme.colors.white} />
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.unpairButton} onPress={handleUnpair}>
            <Text style={styles.unpairButtonText}>Hủy ghép đôi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal chỉnh sửa */}
      {showEditModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editingField === 'options' ? (
              <>
                <Text style={styles.modalTitle}>Chọn thông tin cần sửa</Text>
                <View style={styles.modalOptions}>
                  <TouchableOpacity
                    style={styles.modalOptionBtn}
                    onPress={() => handleOptionSelect('nickname')}
                  >
                    <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
                    <Text style={styles.modalOptionText}>Biệt danh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalOptionBtn}
                    onPress={() => handleOptionSelect('birthDate')}
                  >
                    <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                    <Text style={styles.modalOptionText}>Ngày sinh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalOptionBtn}
                    onPress={() => handleOptionSelect('avatar')}
                  >
                    <Ionicons name="person" size={20} color={theme.colors.primary} />
                    <Text style={styles.modalOptionText}>Avatar</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {editingField === 'nickname' ? 'Chỉnh sửa biệt danh' : 
                   editingField === 'birthDate' ? 'Chỉnh sửa ngày sinh' :
                   'Chỉnh sửa ngày kỷ niệm'}
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={
                    editingField === 'nickname' 
                      ? 'Nhập biệt danh mới' 
                      : editingField === 'birthDate' ? 'YYYY-MM-DD' :
                        'YYYY-MM-DD'
                  }
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalSaveBtn}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.modalSaveText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  profileContainer: {
    marginBottom: theme.spacing.lg,
  },
  profileLabel: {
    marginBottom: theme.spacing.md,
  },
  profileLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  myAvatar: {
    backgroundColor: theme.colors.primary,
  },
  partnerAvatar: {
    backgroundColor: theme.colors.accent,
  },
  previewMiddle: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  previewNickname: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  myNickname: {
    color: theme.colors.text,
  },
  partnerNickname: {
    color: theme.colors.textSecondary,
  },
  previewSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  previewBirth: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  previewEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  previewEditText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  previewEditBtnDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  previewEditTextDisabled: {
    color: theme.colors.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  changeAvatarButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  readOnlyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  editBlock: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  editHint: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.lightGray,
  },
  anniversaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  anniversaryText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  actionButtons: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  saveButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  unpairButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
  },
  unpairButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalCancelBtn: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    width: '40%',
  },
  modalCancelText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSaveBtn: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    width: '40%',
  },
  modalSaveText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOptions: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.lightGray,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
});
