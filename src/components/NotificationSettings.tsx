import React, { useState, useEffect } from 'react';
import { emailService, NotificationSettings } from '../services/emailService';
import { 
  Bell, 
  Mail, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  BarChart3,
  Save,
  Check,
  X
} from 'lucide-react';

interface NotificationSettingsProps {
  userId: string;
  onClose: () => void;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({ userId, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const userSettings = emailService.getUserSettings(userId);
    if (userSettings) {
      setSettings(userSettings);
    } else {
      setSettings(emailService.initializeUserSettings(userId));
    }
  }, [userId]);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      emailService.updateUserSettings(userId, settings);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (!settings) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Notification Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Email Toggle */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-medium text-white">Email Notifications</h3>
                  <p className="text-sm text-white/60">Receive task reminders via email</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notification Types */}
          {settings.emailNotifications && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                Notification Types
              </h4>

              {/* Due Today */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <h5 className="font-medium text-white">Due Today</h5>
                    <p className="text-sm text-white/60">Tasks due today</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('dueTodayReminders', !settings.dueTodayReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dueTodayReminders ? 'bg-orange-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dueTodayReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Due Tomorrow */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h5 className="font-medium text-white">Due Tomorrow</h5>
                    <p className="text-sm text-white/60">Tasks due tomorrow</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('dueTomorrowReminders', !settings.dueTomorrowReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dueTomorrowReminders ? 'bg-yellow-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dueTomorrowReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Overdue */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <h5 className="font-medium text-white">Overdue Tasks</h5>
                    <p className="text-sm text-white/60">Tasks past their due date</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('overdueReminders', !settings.overdueReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.overdueReminders ? 'bg-red-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.overdueReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <div>
                    <h5 className="font-medium text-white">Weekly Digest</h5>
                    <p className="text-sm text-white/60">Weekly summary of your tasks</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.weeklyDigest ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Reminder Time */}
          {settings.emailNotifications && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                Reminder Time
              </h4>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Daily reminder time
                </label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSetting('reminderTime', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                />
                <p className="text-xs text-white/60 mt-2">
                  Notifications will be sent at this time each day
                </p>
              </div>
            </div>
          )}

          {/* Timezone */}
          {settings.emailNotifications && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
              >
                <option value="America/New_York" className="bg-slate-800">Eastern Time</option>
                <option value="America/Chicago" className="bg-slate-800">Central Time</option>
                <option value="America/Denver" className="bg-slate-800">Mountain Time</option>
                <option value="America/Los_Angeles" className="bg-slate-800">Pacific Time</option>
                <option value="Europe/London" className="bg-slate-800">London</option>
                <option value="Europe/Paris" className="bg-slate-800">Paris</option>
                <option value="Asia/Tokyo" className="bg-slate-800">Tokyo</option>
                <option value="Asia/Shanghai" className="bg-slate-800">Shanghai</option>
                <option value="Australia/Sydney" className="bg-slate-800">Sydney</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors backdrop-blur-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsComponent;