import React, { useState, useEffect } from 'react';
import { emailService, EmailNotification } from '../services/emailService';
import { 
  Bell, 
  Mail, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  Check,
  X,
  Settings,
  Trash2,
  Eye
} from 'lucide-react';
import NotificationSettingsComponent from './NotificationSettings';

interface NotificationCenterProps {
  userId: string;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, pending: 0, failed: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = () => {
    const userNotifications = emailService.getUserNotifications(userId);
    const notificationStats = emailService.getNotificationStats(userId);
    setNotifications(userNotifications.sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()));
    setStats(notificationStats);
  };

  const getNotificationIcon = (type: EmailNotification['type']) => {
    switch (type) {
      case 'task_due_today':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'task_due_tomorrow':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'task_overdue':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'weekly_summary':
        return <BarChart3 className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationTitle = (type: EmailNotification['type']) => {
    switch (type) {
      case 'task_due_today':
        return 'Task Due Today';
      case 'task_due_tomorrow':
        return 'Task Due Tomorrow';
      case 'task_overdue':
        return 'Overdue Task';
      case 'weekly_summary':
        return 'Weekly Summary';
      default:
        return 'Notification';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (showSettings) {
    return (
      <NotificationSettingsComponent
        userId={userId}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  if (selectedNotification) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getNotificationIcon(selectedNotification.type)}
                <h2 className="text-xl font-bold text-white">{selectedNotification.emailContent.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center space-x-4 text-sm text-white/60">
              <span>Type: {getNotificationTitle(selectedNotification.type)}</span>
              <span>•</span>
              <span>Scheduled: {selectedNotification.scheduledFor.toLocaleString()}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedNotification.sent 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {selectedNotification.sent ? 'Sent' : 'Pending'}
              </span>
            </div>

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedNotification.emailContent.html }}
            />
          </div>

          <div className="p-6 border-t border-white/20">
            <button
              onClick={() => setSelectedNotification(null)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors backdrop-blur-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Notification Center</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-white/60">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.sent}</div>
              <div className="text-sm text-white/60">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
              <div className="text-sm text-white/60">Failed</div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {notifications.length > 0 ? (
            <div className="p-6 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                    notification.sent 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-yellow-500/10 border-yellow-400/30'
                  }`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {notification.emailContent.subject}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                          {getNotificationTitle(notification.type)}
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-white/50">
                          <span>
                            {notification.sent ? 'Sent' : 'Scheduled for'} {formatDate(notification.sent ? notification.sentAt! : notification.scheduledFor)}
                          </span>
                          {notification.taskId && (
                            <>
                              <span>•</span>
                              <span>Task ID: {notification.taskId.slice(0, 8)}...</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notification.sent 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {notification.sent ? 'Sent' : 'Pending'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotification(notification);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-white/60">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm">Email notifications will appear here when scheduled</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors backdrop-blur-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;