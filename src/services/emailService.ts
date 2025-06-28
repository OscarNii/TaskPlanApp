import { Task, User } from '../types';

export interface EmailNotification {
  id: string;
  userId: string;
  type: 'task_due_today' | 'task_due_tomorrow' | 'task_overdue' | 'weekly_summary';
  taskId?: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  emailContent: {
    subject: string;
    html: string;
    text: string;
  };
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  dueTodayReminders: boolean;
  dueTomorrowReminders: boolean;
  overdueReminders: boolean;
  weeklyDigest: boolean;
  reminderTime: string; // Format: "09:00"
  timezone: string;
}

class EmailService {
  private notifications: EmailNotification[] = [];
  private settings: NotificationSettings[] = [];

  // Initialize default notification settings for a user
  initializeUserSettings(userId: string): NotificationSettings {
    const defaultSettings: NotificationSettings = {
      userId,
      emailNotifications: true,
      dueTodayReminders: true,
      dueTomorrowReminders: true,
      overdueReminders: true,
      weeklyDigest: true,
      reminderTime: "09:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.settings.push(defaultSettings);
    return defaultSettings;
  }

  // Get user notification settings
  getUserSettings(userId: string): NotificationSettings | null {
    return this.settings.find(s => s.userId === userId) || null;
  }

  // Update user notification settings
  updateUserSettings(userId: string, updates: Partial<NotificationSettings>): void {
    const settingsIndex = this.settings.findIndex(s => s.userId === userId);
    if (settingsIndex >= 0) {
      this.settings[settingsIndex] = { ...this.settings[settingsIndex], ...updates };
    } else {
      this.initializeUserSettings(userId);
      this.updateUserSettings(userId, updates);
    }
  }

  // Generate email content for different notification types
  private generateEmailContent(type: EmailNotification['type'], task?: Task, tasks?: Task[]): EmailNotification['emailContent'] {
    switch (type) {
      case 'task_due_today':
        return {
          subject: `📅 Task Due Today: ${task?.title}`,
          html: this.generateTaskDueTodayHTML(task!),
          text: this.generateTaskDueTodayText(task!)
        };
      
      case 'task_due_tomorrow':
        return {
          subject: `⏰ Task Due Tomorrow: ${task?.title}`,
          html: this.generateTaskDueTomorrowHTML(task!),
          text: this.generateTaskDueTomorrowText(task!)
        };
      
      case 'task_overdue':
        return {
          subject: `🚨 Overdue Task: ${task?.title}`,
          html: this.generateTaskOverdueHTML(task!),
          text: this.generateTaskOverdueText(task!)
        };
      
      case 'weekly_summary':
        return {
          subject: `📊 Your Weekly Task Summary`,
          html: this.generateWeeklySummaryHTML(tasks || []),
          text: this.generateWeeklySummaryText(tasks || [])
        };
      
      default:
        return {
          subject: 'TaskFlow Notification',
          html: '<p>You have a notification from TaskFlow.</p>',
          text: 'You have a notification from TaskFlow.'
        };
    }
  }

  // HTML email templates
  private generateTaskDueTodayHTML(task: Task): string {
    const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Due Today</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 32px;">📅</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Task Due Today</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 16px;">Don't forget about this important task!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <div style="background: #F8FAFC; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${priorityColor};">
                <h2 style="margin: 0 0 12px 0; color: #1F2937; font-size: 20px; font-weight: 600;">${task.title}</h2>
                ${task.description ? `<p style="margin: 0 0 16px 0; color: #6B7280; line-height: 1.6;">${task.description}</p>` : ''}
                
                <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
                  <div style="background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    ${task.priority} Priority
                  </div>
                  ${task.dueDate ? `<div style="background: #E5E7EB; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                    Due: ${new Date(task.dueDate).toLocaleDateString()}
                  </div>` : ''}
                </div>
              </div>
              
              ${task.subtasks.length > 0 ? `
                <div style="margin-bottom: 24px;">
                  <h3 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Subtasks (${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} completed)</h3>
                  <div style="space-y: 8px;">
                    ${task.subtasks.map(subtask => `
                      <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
                        <div style="width: 16px; height: 16px; border: 2px solid ${subtask.completed ? '#10B981' : '#D1D5DB'}; border-radius: 4px; background: ${subtask.completed ? '#10B981' : 'transparent'}; display: flex; align-items: center; justify-content: center;">
                          ${subtask.completed ? '<span style="color: white; font-size: 10px;">✓</span>' : ''}
                        </div>
                        <span style="color: ${subtask.completed ? '#6B7280' : '#374151'}; text-decoration: ${subtask.completed ? 'line-through' : 'none'}; font-size: 14px;">${subtask.title}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/tasks" style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  View Task in TaskFlow
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                You're receiving this because you have email notifications enabled in TaskFlow.
              </p>
              <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 12px;">
                <a href="#" style="color: #6B7280; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #6B7280; text-decoration: none;">Manage Preferences</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateTaskDueTomorrowHTML(task: Task): string {
    const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Due Tomorrow</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #F59E0B, #EF4444); padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 32px;">⏰</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Task Due Tomorrow</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 16px;">Get ready for tomorrow's deadline!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <div style="background: #FEF3C7; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${priorityColor};">
                <h2 style="margin: 0 0 12px 0; color: #1F2937; font-size: 20px; font-weight: 600;">${task.title}</h2>
                ${task.description ? `<p style="margin: 0 0 16px 0; color: #6B7280; line-height: 1.6;">${task.description}</p>` : ''}
                
                <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
                  <div style="background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    ${task.priority} Priority
                  </div>
                  <div style="background: #FCD34D; color: #92400E; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    Due Tomorrow
                  </div>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/tasks" style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EF4444); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Complete Task Now
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                You're receiving this because you have email notifications enabled in TaskFlow.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateTaskOverdueHTML(task: Task): string {
    const daysOverdue = task.dueDate ? Math.floor((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Overdue Task</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 32px;">🚨</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Task Overdue</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 16px;">This task needs immediate attention!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <div style="background: #FEE2E2; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #EF4444;">
                <h2 style="margin: 0 0 12px 0; color: #1F2937; font-size: 20px; font-weight: 600;">${task.title}</h2>
                ${task.description ? `<p style="margin: 0 0 16px 0; color: #6B7280; line-height: 1.6;">${task.description}</p>` : ''}
                
                <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
                  <div style="background: #EF4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    ${task.priority} Priority
                  </div>
                  <div style="background: #FCA5A5; color: #991B1B; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue
                  </div>
                </div>
              </div>
              
              <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991B1B; font-size: 14px; font-weight: 500;">
                  ⚠️ This task was due on ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'} and is now ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue.
                </p>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/tasks" style="display: inline-block; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Complete Now
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                You're receiving this because you have email notifications enabled in TaskFlow.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateWeeklySummaryHTML(tasks: Task[]): string {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weekly Task Summary</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 32px;">📊</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Weekly Summary</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 16px;">Your productivity overview</p>
            </div>
            
            <!-- Stats -->
            <div style="padding: 32px;">
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
                <div style="background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 12px; padding: 20px; text-align: center;">
                  <div style="font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 4px;">${completedTasks.length}</div>
                  <div style="font-size: 14px; color: #065F46; font-weight: 500;">Completed</div>
                </div>
                <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 20px; text-align: center;">
                  <div style="font-size: 32px; font-weight: bold; color: #D97706; margin-bottom: 4px;">${pendingTasks.length}</div>
                  <div style="font-size: 14px; color: #92400E; font-weight: 500;">Pending</div>
                </div>
                <div style="background: #FEE2E2; border: 1px solid #FECACA; border-radius: 12px; padding: 20px; text-align: center;">
                  <div style="font-size: 32px; font-weight: bold; color: #DC2626; margin-bottom: 4px;">${overdueTasks.length}</div>
                  <div style="font-size: 14px; color: #991B1B; font-weight: 500;">Overdue</div>
                </div>
              </div>
              
              ${pendingTasks.length > 0 ? `
                <div style="margin-bottom: 24px;">
                  <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Upcoming Tasks</h3>
                  <div style="space-y: 12px;">
                    ${pendingTasks.slice(0, 5).map(task => `
                      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                          <h4 style="margin: 0; color: #1F2937; font-size: 16px; font-weight: 600;">${task.title}</h4>
                          <span style="background: ${task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; text-transform: uppercase;">
                            ${task.priority}
                          </span>
                        </div>
                        ${task.dueDate ? `<p style="margin: 0; color: #6B7280; font-size: 14px;">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                  ${pendingTasks.length > 5 ? `<p style="margin: 16px 0 0 0; color: #6B7280; font-size: 14px; text-align: center;">And ${pendingTasks.length - 5} more tasks...</p>` : ''}
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  View Dashboard
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                You're receiving this weekly summary because you have email notifications enabled in TaskFlow.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Text email templates (fallback)
  private generateTaskDueTodayText(task: Task): string {
    return `
TASK DUE TODAY: ${task.title}

${task.description ? `Description: ${task.description}\n` : ''}
Priority: ${task.priority.toUpperCase()}
${task.dueDate ? `Due Date: ${new Date(task.dueDate).toLocaleDateString()}\n` : ''}

${task.subtasks.length > 0 ? `Subtasks (${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} completed):\n${task.subtasks.map(st => `${st.completed ? '✓' : '○'} ${st.title}`).join('\n')}\n` : ''}

Don't forget to complete this task today!

View in TaskFlow: http://localhost:5173/tasks
    `.trim();
  }

  private generateTaskDueTomorrowText(task: Task): string {
    return `
TASK DUE TOMORROW: ${task.title}

${task.description ? `Description: ${task.description}\n` : ''}
Priority: ${task.priority.toUpperCase()}
Due Date: Tomorrow

Get ready for tomorrow's deadline!

View in TaskFlow: http://localhost:5173/tasks
    `.trim();
  }

  private generateTaskOverdueText(task: Task): string {
    const daysOverdue = task.dueDate ? Math.floor((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return `
OVERDUE TASK: ${task.title}

${task.description ? `Description: ${task.description}\n` : ''}
Priority: ${task.priority.toUpperCase()}
Originally Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
Days Overdue: ${daysOverdue}

This task needs immediate attention!

View in TaskFlow: http://localhost:5173/tasks
    `.trim();
  }

  private generateWeeklySummaryText(tasks: Task[]): string {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
    
    return `
WEEKLY TASK SUMMARY

Statistics:
- Completed: ${completedTasks.length}
- Pending: ${pendingTasks.length}
- Overdue: ${overdueTasks.length}

${pendingTasks.length > 0 ? `
Upcoming Tasks:
${pendingTasks.slice(0, 5).map(task => `• ${task.title} (${task.priority} priority)${task.dueDate ? ` - Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}`).join('\n')}
${pendingTasks.length > 5 ? `\nAnd ${pendingTasks.length - 5} more tasks...` : ''}
` : ''}

View Dashboard: http://localhost:5173/
    `.trim();
  }

  // Schedule notifications for tasks
  scheduleTaskNotifications(tasks: Task[], userId: string): void {
    const settings = this.getUserSettings(userId);
    if (!settings || !settings.emailNotifications) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    tasks.forEach(task => {
      if (task.completed || !task.dueDate) return;

      const taskDate = new Date(task.dueDate);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

      // Schedule due today notification
      if (settings.dueTodayReminders && taskDay.getTime() === today.getTime()) {
        this.scheduleNotification({
          userId,
          type: 'task_due_today',
          taskId: task.id,
          scheduledFor: this.getScheduledTime(today, settings.reminderTime),
          emailContent: this.generateEmailContent('task_due_today', task)
        });
      }

      // Schedule due tomorrow notification
      if (settings.dueTomorrowReminders && taskDay.getTime() === tomorrow.getTime()) {
        this.scheduleNotification({
          userId,
          type: 'task_due_tomorrow',
          taskId: task.id,
          scheduledFor: this.getScheduledTime(today, settings.reminderTime),
          emailContent: this.generateEmailContent('task_due_tomorrow', task)
        });
      }

      // Schedule overdue notification
      if (settings.overdueReminders && taskDay.getTime() < today.getTime()) {
        this.scheduleNotification({
          userId,
          type: 'task_overdue',
          taskId: task.id,
          scheduledFor: this.getScheduledTime(today, settings.reminderTime),
          emailContent: this.generateEmailContent('task_overdue', task)
        });
      }
    });
  }

  // Schedule weekly summary
  scheduleWeeklySummary(tasks: Task[], userId: string): void {
    const settings = this.getUserSettings(userId);
    if (!settings || !settings.emailNotifications || !settings.weeklyDigest) return;

    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    
    this.scheduleNotification({
      userId,
      type: 'weekly_summary',
      scheduledFor: this.getScheduledTime(nextMonday, settings.reminderTime),
      emailContent: this.generateEmailContent('weekly_summary', undefined, tasks)
    });
  }

  // Helper to get scheduled time
  private getScheduledTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);
    return scheduledDate;
  }

  // Schedule a notification
  private scheduleNotification(notification: Omit<EmailNotification, 'id' | 'sent'>): void {
    const newNotification: EmailNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sent: false
    };

    // Remove existing notifications of the same type for the same task
    this.notifications = this.notifications.filter(n => 
      !(n.userId === notification.userId && 
        n.type === notification.type && 
        n.taskId === notification.taskId)
    );

    this.notifications.push(newNotification);
  }

  // Send pending notifications
  async sendPendingNotifications(): Promise<void> {
    const now = new Date();
    const pendingNotifications = this.notifications.filter(n => 
      !n.sent && n.scheduledFor <= now
    );

    for (const notification of pendingNotifications) {
      try {
        await this.sendEmail(notification);
        notification.sent = true;
        notification.sentAt = new Date();
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }

  // Mock email sending (in production, use actual email service)
  private async sendEmail(notification: EmailNotification): Promise<void> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('📧 Email sent:', {
      to: `user-${notification.userId}@example.com`,
      subject: notification.emailContent.subject,
      type: notification.type,
      taskId: notification.taskId,
      sentAt: new Date().toISOString()
    });

    // In production, you would use a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // etc.
  }

  // Get all notifications for a user
  getUserNotifications(userId: string): EmailNotification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  // Get notification statistics
  getNotificationStats(userId: string): {
    total: number;
    sent: number;
    pending: number;
    failed: number;
  } {
    const userNotifications = this.getUserNotifications(userId);
    return {
      total: userNotifications.length,
      sent: userNotifications.filter(n => n.sent).length,
      pending: userNotifications.filter(n => !n.sent && n.scheduledFor > new Date()).length,
      failed: userNotifications.filter(n => !n.sent && n.scheduledFor <= new Date()).length
    };
  }
}

export const emailService = new EmailService();