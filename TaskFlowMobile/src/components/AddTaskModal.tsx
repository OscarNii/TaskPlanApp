import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTask } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  defaultStatus?: Task['status'];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAdd,
  defaultStatus = 'todo'
}) => {
  const { addTask, projects } = useTask();
  const { isDark } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: undefined as Date | undefined,
    projectId: projects[0]?.id || '',
    tags: [] as string[],
    subtasks: [] as { id: string; title: string; completed: boolean }[],
    status: defaultStatus,
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await addTask({
        ...formData,
        completed: formData.status === 'done',
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: undefined,
        projectId: projects[0]?.id || '',
        tags: [],
        subtasks: [],
        status: defaultStatus,
      });
      
      onAdd();
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelButton, { color: '#667eea' }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Add Task
          </Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.saveButton, { color: '#667eea' }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937'
                }
              ]}
              placeholder="Enter task title..."
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937'
                }
              ]}
              placeholder="Enter task description..."
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    formData.priority === priority && styles.priorityButtonActive,
                    { backgroundColor: isDark ? '#374151' : '#FFFFFF' }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, priority }))}
                >
                  <Text style={[
                    styles.priorityText,
                    { color: isDark ? '#FFFFFF' : '#1F2937' },
                    formData.priority === priority && styles.priorityTextActive
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Due Date
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: isDark ? '#374151' : '#FFFFFF' }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text style={[
                styles.dateText,
                { color: formData.dueDate ? (isDark ? '#FFFFFF' : '#1F2937') : '#9CA3AF' }
              ]}>
                {formData.dueDate ? formData.dueDate.toLocaleDateString() : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Project */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Project
            </Text>
            <View style={styles.projectContainer}>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectButton,
                    formData.projectId === project.id && styles.projectButtonActive,
                    { backgroundColor: isDark ? '#374151' : '#FFFFFF' }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, projectId: project.id }))}
                >
                  <View style={[styles.projectDot, { backgroundColor: project.color }]} />
                  <Text style={[
                    styles.projectText,
                    { color: isDark ? '#FFFFFF' : '#1F2937' },
                    formData.projectId === project.id && styles.projectTextActive
                  ]}>
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={formData.dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  cancelButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
  },
  projectContainer: {
    gap: 8,
  },
  projectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  projectButtonActive: {
    borderColor: '#667eea',
  },
  projectDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  projectText: {
    fontSize: 16,
    fontWeight: '500',
  },
  projectTextActive: {
    color: '#667eea',
  },
});

export default AddTaskModal;