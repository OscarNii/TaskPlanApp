import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTask } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { toggleTask, deleteTask, projects } = useTask();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#374151' : '#FFFFFF' },
      isOverdue && styles.overdue,
      task.completed && styles.completed
    ]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={task.completed ? '#10B981' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#1F2937' },
            task.completed && styles.completedText
          ]}>
            {task.title}
          </Text>
          
          {!compact && task.description && (
            <Text style={[
              styles.description,
              { color: isDark ? '#9CA3AF' : '#6B7280' }
            ]}>
              {task.description}
            </Text>
          )}

          <View style={styles.metadata}>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) + '20' }
            ]}>
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(task.priority) }
              ]}>
                {task.priority}
              </Text>
            </View>

            {task.dueDate && (
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text style={[
                  styles.dateText,
                  { color: isOverdue ? '#EF4444' : '#9CA3AF' }
                ]}>
                  {formatDate(new Date(task.dueDate))}
                </Text>
              </View>
            )}

            {project && (
              <View style={styles.projectContainer}>
                <View style={[
                  styles.projectDot,
                  { backgroundColor: project.color }
                ]} />
                <Text style={[
                  styles.projectText,
                  { color: isDark ? '#9CA3AF' : '#6B7280' }
                ]}>
                  {project.name}
                </Text>
              </View>
            )}
          </View>

          {task.subtasks.length > 0 && (
            <View style={styles.subtasksContainer}>
              <Text style={[
                styles.subtasksText,
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  completed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  projectText: {
    fontSize: 12,
  },
  subtasksContainer: {
    marginTop: 8,
  },
  subtasksText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});

export default TaskCard;