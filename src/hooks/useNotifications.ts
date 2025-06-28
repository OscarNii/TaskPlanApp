import { useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import { emailService } from '../services/emailService';

export const useNotifications = (userId: string) => {
  const { tasks } = useTask();

  useEffect(() => {
    // Initialize user settings if they don't exist
    if (!emailService.getUserSettings(userId)) {
      emailService.initializeUserSettings(userId);
    }

    // Schedule notifications for current tasks
    emailService.scheduleTaskNotifications(tasks, userId);
    emailService.scheduleWeeklySummary(tasks, userId);

    // Set up interval to send pending notifications
    const interval = setInterval(() => {
      emailService.sendPendingNotifications();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks, userId]);

  // Trigger immediate notification check when tasks change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      emailService.sendPendingNotifications();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tasks]);

  return {
    getUserSettings: () => emailService.getUserSettings(userId),
    updateUserSettings: (settings: any) => emailService.updateUserSettings(userId, settings),
    getUserNotifications: () => emailService.getUserNotifications(userId),
    getNotificationStats: () => emailService.getNotificationStats(userId)
  };
};