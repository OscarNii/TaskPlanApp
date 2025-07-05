import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const { tasks, getTaskStats } = useTask();
  const { user, profile } = useAuth();
  const { isDark } = useTheme();
  const stats = getTaskStats();

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate.toDateString() === today.toDateString();
  });

  const overdueTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate < today && !task.completed;
  });

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    if (hour < 21) return `Good evening, ${name}! 🌅`;
    return `Good night, ${name}! 🌙`;
  };

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        {trend && (
          <Text style={[styles.trend, { color: trend.startsWith('+') ? '#10B981' : '#EF4444' }]}>
            {trend}
          </Text>
        )}
      </View>
      <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>
            {stats.pending === 0 
              ? "You're all caught up! 🎉" 
              : `You have ${stats.pending} task${stats.pending !== 1 ? 's' : ''} to complete`
            }
          </Text>
          
          <View style={styles.completionContainer}>
            <Text style={styles.completionRate}>{completionRate}%</Text>
            <Text style={styles.completionLabel}>Completion Rate</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon="list"
              color="#3B82F6"
              trend="+12%"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon="checkmark-circle"
              color="#10B981"
              trend="+8%"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Due Today"
              value={todayTasks.length}
              icon="calendar"
              color="#F59E0B"
              trend="-3%"
            />
            <StatCard
              title="Overdue"
              value={overdueTasks.length}
              icon="alert-triangle"
              color="#EF4444"
              trend="-15%"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Today's Tasks
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]}>
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <View style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: task.priority === 'high' ? '#FEE2E2' : 
                                         task.priority === 'medium' ? '#FEF3C7' : '#ECFDF5'
                        }
                      ]}>
                        <Text style={[
                          styles.priorityText,
                          {
                            color: task.priority === 'high' ? '#DC2626' : 
                                   task.priority === 'medium' ? '#D97706' : '#059669'
                          }
                        ]}>
                          {task.priority}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.taskAction}>
                    <Ionicons 
                      name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={24} 
                      color={task.completed ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  No tasks due today
                </Text>
                <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                  Enjoy your free time! 🎉
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* High Priority Tasks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            High Priority
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]}>
            {tasks.filter(t => t.priority === 'high' && !t.completed).length > 0 ? (
              tasks.filter(t => t.priority === 'high' && !t.completed).slice(0, 3).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                      {task.title}
                    </Text>
                    {task.dueDate && (
                      <Text style={[styles.taskDate, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.priorityIndicator} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#9CA3AF" />
                <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  No high priority tasks
                </Text>
                <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                  You're managing priorities well! 👍
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  completionContainer: {
    alignItems: 'center',
  },
  completionRate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 14,
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
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  taskAction: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default DashboardScreen;