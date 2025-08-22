import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function TodoScreen() {
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: 'Đi du lịch Đà Nẵng',
      description: 'Lên kế hoạch cho chuyến du lịch 3 ngày 2 đêm',
      completed: false,
      assignedTo: 'both',
      priority: 'high',
      dueDate: '2024-12-30',
      category: 'travel',
    },
    {
      id: '2',
      title: 'Mua quà sinh nhật',
      description: 'Chuẩn bị quà sinh nhật cho người yêu',
      completed: false,
      assignedTo: 'partner1',
      priority: 'medium',
      dueDate: '2024-12-28',
      category: 'gift',
    },
    {
      id: '3',
      title: 'Dọn dẹp nhà cửa',
      description: 'Dọn dẹp và trang trí nhà cho năm mới',
      completed: true,
      assignedTo: 'both',
      priority: 'low',
      dueDate: '2024-12-25',
      category: 'home',
    },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    assignedTo: 'both',
    priority: 'medium',
    dueDate: '',
    category: 'general',
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.gray;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'travel':
        return 'airplane';
      case 'gift':
        return 'gift';
      case 'home':
        return 'home';
      case 'food':
        return 'restaurant';
      case 'shopping':
        return 'bag';
      default:
        return 'checkmark-circle';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel':
        return theme.colors.info;
      case 'gift':
        return theme.colors.accent;
      case 'home':
        return theme.colors.success;
      case 'food':
        return theme.colors.warning;
      case 'shopping':
        return theme.colors.primary;
      default:
        return theme.colors.gray;
    }
  };

  const getAssignedToText = (assignedTo) => {
    switch (assignedTo) {
      case 'both':
        return 'Cả hai';
      case 'partner1':
        return 'Nguyễn Văn A';
      case 'partner2':
        return 'Trần Thị B';
      default:
        return 'Chưa phân công';
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa task này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => todo.id !== id)),
        },
      ]
    );
  };

  const addTodo = () => {
    if (!newTodo.title) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề task');
      return;
    }

    const todo = {
      id: Date.now().toString(),
      ...newTodo,
      completed: false,
    };

    setTodos([todo, ...todos]);
    setNewTodo({
      title: '',
      description: '',
      assignedTo: 'both',
      priority: 'medium',
      dueDate: '',
      category: 'general',
    });
    setShowAddModal(false);
  };

  const renderTodoItem = (todo) => (
    <View key={todo.id} style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoCheckbox}
        onPress={() => toggleTodo(todo.id)}
      >
        <Ionicons
          name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={todo.completed ? theme.colors.success : theme.colors.gray}
        />
      </TouchableOpacity>

      <View style={styles.todoContent}>
        <View style={styles.todoHeader}>
          <Text style={[
            styles.todoTitle,
            todo.completed && styles.todoTitleCompleted
          ]}>
            {todo.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}>
            <Text style={styles.priorityText}>
              {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </Text>
          </View>
        </View>

        {todo.description && (
          <Text style={[
            styles.todoDescription,
            todo.completed && styles.todoDescriptionCompleted
          ]}>
            {todo.description}
          </Text>
        )}

        <View style={styles.todoFooter}>
          <View style={styles.todoMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(todo.category) }]}>
              <Ionicons name={getCategoryIcon(todo.category)} size={14} color={theme.colors.white} />
              <Text style={styles.categoryText}>
                {todo.category === 'travel' ? 'Du lịch' :
                 todo.category === 'gift' ? 'Quà tặng' :
                 todo.category === 'home' ? 'Nhà cửa' :
                 todo.category === 'food' ? 'Ẩm thực' :
                 todo.category === 'shopping' ? 'Mua sắm' : 'Chung'}
              </Text>
            </View>
            
            <View style={styles.assignedTo}>
              <Ionicons name="person" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.assignedToText}>{getAssignedToText(todo.assignedTo)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTodo(todo.id)}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Việc chung</Text>
          <Text style={styles.headerSubtitle}>Cùng nhau hoàn thành mọi việc</Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todos.length}</Text>
          <Text style={styles.statLabel}>Tổng cộng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{activeTodos.length}</Text>
          <Text style={styles.statLabel}>Đang làm</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedTodos.length}</Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
      </View>

      {/* Add Todo Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
          <Text style={styles.addButtonText}>Thêm việc mới</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Todo Lists */}
      <ScrollView style={styles.todoLists} showsVerticalScrollIndicator={false}>
        {/* Active Todos */}
        {activeTodos.length > 0 && (
          <View style={styles.todoSection}>
            <Text style={styles.sectionTitle}>Đang làm ({activeTodos.length})</Text>
            {activeTodos.map(renderTodoItem)}
          </View>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <View style={styles.todoSection}>
            <Text style={styles.sectionTitle}>Đã hoàn thành ({completedTodos.length})</Text>
            {completedTodos.map(renderTodoItem)}
          </View>
        )}

        {todos.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={theme.colors.gray} />
            <Text style={styles.emptyStateTitle}>Chưa có việc nào</Text>
            <Text style={styles.emptyStateSubtitle}>Hãy thêm việc đầu tiên để bắt đầu!</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Todo Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm việc mới</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiêu đề *</Text>
              <TextInput
                style={styles.input}
                value={newTodo.title}
                onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
                placeholder="Nhập tiêu đề việc cần làm"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                style={styles.input}
                value={newTodo.description}
                onChangeText={(text) => setNewTodo({ ...newTodo, description: text })}
                placeholder="Nhập mô tả chi tiết"
                multiline
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                <Text style={styles.inputLabel}>Độ ưu tiên</Text>
                <View style={styles.prioritySelector}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newTodo.priority === priority && styles.priorityOptionSelected,
                      ]}
                      onPress={() => setNewTodo({ ...newTodo, priority })}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newTodo.priority === priority && styles.priorityOptionTextSelected,
                      ]}>
                        {priority === 'high' ? 'Cao' : priority === 'medium' ? 'TB' : 'Thấp'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Phân công</Text>
                <View style={styles.assignedSelector}>
                  {['both', 'partner1', 'partner2'].map((assigned) => (
                    <TouchableOpacity
                      key={assigned}
                      style={[
                        styles.assignedOption,
                        newTodo.assignedTo === assigned && styles.assignedOptionSelected,
                      ]}
                      onPress={() => setNewTodo({ ...newTodo, assignedTo: assigned })}
                    >
                      <Text style={[
                        styles.assignedOptionText,
                        newTodo.assignedTo === assigned && styles.assignedOptionTextSelected,
                      ]}>
                        {assigned === 'both' ? 'Cả hai' : assigned === 'partner1' ? 'A' : 'B'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục</Text>
              <View style={styles.categorySelector}>
                {['general', 'travel', 'gift', 'home', 'food', 'shopping'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newTodo.category === category && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setNewTodo({ ...newTodo, category })}
                  >
                    <Ionicons
                      name={getCategoryIcon(category)}
                      size={16}
                      color={newTodo.category === category ? theme.colors.white : getCategoryColor(category)}
                    />
                    <Text style={[
                      styles.categoryOptionText,
                      newTodo.category === category && styles.categoryOptionTextSelected,
                    ]}>
                      {category === 'general' ? 'Chung' :
                       category === 'travel' ? 'Du lịch' :
                       category === 'gift' ? 'Quà tặng' :
                       category === 'home' ? 'Nhà cửa' :
                       category === 'food' ? 'Ẩm thực' : 'Mua sắm'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={addTodo}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Thêm việc</Text>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.small,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  todoLists: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  todoSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  todoCheckbox: {
    marginRight: theme.spacing.md,
    justifyContent: 'center',
  },
  todoContent: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.gray,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  priorityText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: '600',
  },
  todoDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  todoDescriptionCompleted: {
    color: theme.colors.gray,
  },
  todoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    gap: theme.spacing.xs,
  },
  categoryText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: '600',
  },
  assignedTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  assignedToText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
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
  prioritySelector: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.lightGray,
    alignItems: 'center',
  },
  priorityOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  priorityOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  priorityOptionTextSelected: {
    color: theme.colors.white,
  },
  assignedSelector: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  assignedOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.lightGray,
    alignItems: 'center',
  },
  assignedOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  assignedOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  assignedOptionTextSelected: {
    color: theme.colors.white,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.lightGray,
    gap: theme.spacing.xs,
  },
  categoryOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  categoryOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  categoryOptionTextSelected: {
    color: theme.colors.white,
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
