import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    type: 'date',
  });

  // Dữ liệu mẫu cho các sự kiện
  const sampleEvents = {
    '2024-12-25': [
      {
        id: '1',
        title: 'Kỷ niệm 1 năm yêu nhau',
        description: 'Chuẩn bị quà và bữa tối lãng mạn',
        time: '19:00',
        location: 'Nhà hàng ABC',
        type: 'anniversary',
      },
    ],
    '2024-12-28': [
      {
        id: '2',
        title: 'Hẹn hò cuối tuần',
        description: 'Đi xem phim và ăn tối',
        time: '18:00',
        location: 'Rạp chiếu phim XYZ',
        type: 'date',
      },
    ],
    '2024-12-30': [
      {
        id: '3',
        title: 'Chuẩn bị năm mới',
        description: 'Mua sắm và trang trí nhà',
        time: '14:00',
        location: 'Trung tâm thương mại',
        type: 'shopping',
      },
    ],
  };

  const [markedDates, setMarkedDates] = useState(() => {
    const marked = {};
    Object.keys(sampleEvents).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: getEventColor(sampleEvents[date][0].type),
        selected: false,
      };
    });
    return marked;
  });

  function getEventColor(type) {
    switch (type) {
      case 'anniversary':
        return theme.colors.love;
      case 'date':
        return theme.colors.primary;
      case 'shopping':
        return theme.colors.accent;
      case 'travel':
        return theme.colors.info;
      default:
        return theme.colors.success;
    }
  }

  function getEventIcon(type) {
    switch (type) {
      case 'anniversary':
        return 'heart';
      case 'date':
        return 'restaurant';
      case 'shopping':
        return 'bag';
      case 'travel':
        return 'airplane';
      default:
        return 'star';
    }
  }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const updatedMarked = { ...markedDates };
    
    // Reset tất cả selected
    Object.keys(updatedMarked).forEach(key => {
      updatedMarked[key].selected = false;
    });
    
    // Set selected cho ngày được chọn
    if (updatedMarked[day.dateString]) {
      updatedMarked[day.dateString].selected = true;
    } else {
      updatedMarked[day.dateString] = {
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }
    
    setMarkedDates(updatedMarked);
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề và thời gian');
      return;
    }

    const eventId = Date.now().toString();
    const event = {
      id: eventId,
      ...newEvent,
    };

    const updatedEvents = { ...events };
    if (!updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = [];
    }
    updatedEvents[selectedDate].push(event);

    // Cập nhật marked dates
    const updatedMarked = { ...markedDates };
    if (!updatedMarked[selectedDate]) {
      updatedMarked[selectedDate] = {
        marked: true,
        dotColor: getEventColor(event.type),
        selected: true,
      };
    } else {
      updatedMarked[selectedDate].selected = true;
    }

    setEvents(updatedEvents);
    setMarkedDates(updatedMarked);
    setNewEvent({
      title: '',
      description: '',
      time: '',
      location: '',
      type: 'date',
    });
    setShowAddModal(false);
  };

  const renderEventItem = (event) => (
    <View key={event.id} style={styles.eventItem}>
      <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) }]}>
        <Ionicons name={getEventIcon(event.type)} size={20} color={theme.colors.white} />
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          {event.location && (
            <View style={styles.eventDetail}>
            <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Lịch hẹn hò</Text>
          <Text style={styles.headerSubtitle}>Lên kế hoạch cho những ngày đẹp</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              calendarBackground: theme.colors.surface,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.white,
              todayTextColor: theme.colors.love,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.gray,
              dotColor: theme.colors.primary,
              selectedDotColor: theme.colors.white,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text,
              indicatorColor: theme.colors.primary,
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* Events cho ngày được chọn */}
        {selectedDate && (
          <View style={styles.eventsContainer}>
            <View style={styles.eventsHeader}>
              <Text style={styles.eventsTitle}>
                Sự kiện ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </Text>
              <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => setShowAddModal(true)}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  style={styles.addEventButtonGradient}
                >
                  <Ionicons name="add" size={20} color={theme.colors.white} />
                  <Text style={styles.addEventButtonText}>Thêm sự kiện</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.eventsList}>
              {sampleEvents[selectedDate]?.map(renderEventItem) || (
                <View style={styles.noEvents}>
                  <Ionicons name="calendar-outline" size={48} color={theme.colors.gray} />
                  <Text style={styles.noEventsText}>Không có sự kiện nào</Text>
                  <Text style={styles.noEventsSubtext}>Hãy thêm sự kiện mới!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Modal thêm sự kiện */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm sự kiện mới</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiêu đề</Text>
              <TextInput
                style={styles.input}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                placeholder="Nhập tiêu đề sự kiện"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                style={styles.input}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                placeholder="Nhập mô tả sự kiện"
                multiline
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                <Text style={styles.inputLabel}>Thời gian</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.time}
                  onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
                  placeholder="19:00"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Loại</Text>
                <View style={styles.typeSelector}>
                  {['date', 'anniversary', 'shopping', 'travel'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newEvent.type === type && styles.typeOptionSelected,
                      ]}
                      onPress={() => setNewEvent({ ...newEvent, type })}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        newEvent.type === type && styles.typeOptionTextSelected,
                      ]}>
                        {type === 'date' ? 'Hẹn hò' : 
                         type === 'anniversary' ? 'Kỷ niệm' :
                         type === 'shopping' ? 'Mua sắm' : 'Du lịch'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Địa điểm</Text>
              <TextInput
                style={styles.input}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                placeholder="Nhập địa điểm"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Lưu sự kiện</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 30,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl, // Add padding at the bottom for the modal
  },
  calendarContainer: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  eventsContainer: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
    maxHeight: 400, // Giới hạn chiều cao
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    minHeight: 60, // Đảm bảo header đủ cao
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1, // Cho phép text wrap
    marginRight: theme.spacing.md, // Tạo khoảng cách với button
  },
  addEventButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    minWidth: 120, // Đảm bảo button đủ rộng
  },
  addEventButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  addEventButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
  },
  eventsList: {
    padding: theme.spacing.lg,
    maxHeight: 300, // Giới hạn chiều cao list
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  eventDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  eventDetailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  noEvents: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noEventsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: width - theme.spacing.md * 4,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
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
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  typeOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.lightGray,
  },
  typeOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  typeOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
