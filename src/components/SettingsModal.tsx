import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Save,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Clock,
  Calendar,
  BarChart3,
  Eye,
  EyeOff,
  Key,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  onClose: () => void;
}

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    dueTodayReminders: boolean;
    dueTomorrowReminders: boolean;
    overdueReminders: boolean;
    weeklyDigest: boolean;
    reminderTime: string;
    sound: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    animations: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
    dataSharing: boolean;
  };
  advanced: {
    autoSave: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    maxTasks: number;
    debugMode: boolean;
  };
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('taskflow-settings');
      const userData = localStorage.getItem('taskflow-user');
      
      let userInfo = { name: 'Guest User', email: 'guest@taskflow.com' };
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          userInfo = { name: parsed.name, email: parsed.email };
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({
            ...parsed,
            profile: { ...parsed.profile, ...userInfo }
          });
        } catch (error) {
          console.error('Error parsing settings:', error);
          setSettings(getDefaultSettings(userInfo));
        }
      } else {
        setSettings(getDefaultSettings(userInfo));
      }
    };

    loadSettings();
  }, []);

  const getDefaultSettings = (userInfo: { name: string; email: string }): UserSettings => ({
    profile: {
      name: userInfo.name,
      email: userInfo.email,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en'
    },
    notifications: {
      email: true,
      push: true,
      dueTodayReminders: true,
      dueTomorrowReminders: true,
      overdueReminders: true,
      weeklyDigest: true,
      reminderTime: '09:00',
      sound: true
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true,
      fontSize: 'medium'
    },
    privacy: {
      analytics: true,
      crashReports: true,
      dataSharing: false
    },
    advanced: {
      autoSave: true,
      backupFrequency: 'weekly',
      maxTasks: 1000,
      debugMode: false
    }
  });

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('taskflow-settings', JSON.stringify(settings));
      
      // Update user data if profile changed
      const userData = localStorage.getItem('taskflow-user');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const updatedUser = {
            ...parsed,
            name: settings.profile.name,
            email: settings.profile.email
          };
          localStorage.setItem('taskflow-user', JSON.stringify(updatedUser));
          
          // Trigger auth change to update UI
          window.dispatchEvent(new CustomEvent('auth-change'));
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      settings,
      tasks: localStorage.getItem('taskflow-tasks'),
      projects: localStorage.getItem('taskflow-projects'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.tasks) {
          localStorage.setItem('taskflow-tasks', data.tasks);
        }
        if (data.projects) {
          localStorage.setItem('taskflow-projects', data.projects);
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('taskflow-tasks');
      localStorage.removeItem('taskflow-projects');
      localStorage.removeItem('taskflow-settings');
      alert('All data has been cleared.');
      window.location.reload();
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Database }
  ];

  if (!settings) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 border-r border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white shadow-lg border border-white/20'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white capitalize">{activeTab}</h3>
                <p className="text-white/60 mt-1">
                  {activeTab === 'profile' && 'Manage your personal information'}
                  {activeTab === 'notifications' && 'Configure notification preferences'}
                  {activeTab === 'appearance' && 'Customize the app appearance'}
                  {activeTab === 'privacy' && 'Control your privacy settings'}
                  {activeTab === 'advanced' && 'Advanced configuration options'}
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <Check size={16} />
                ) : (
                  <Save size={16} />
                )}
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.profile.timezone}
                      onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                    >
                      <option value="America/New_York" className="bg-slate-800">Eastern Time</option>
                      <option value="America/Chicago" className="bg-slate-800">Central Time</option>
                      <option value="America/Denver" className="bg-slate-800">Mountain Time</option>
                      <option value="America/Los_Angeles" className="bg-slate-800">Pacific Time</option>
                      <option value="Europe/London" className="bg-slate-800">London</option>
                      <option value="Europe/Paris" className="bg-slate-800">Paris</option>
                      <option value="Asia/Tokyo" className="bg-slate-800">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.profile.language}
                      onChange={(e) => updateSettings('profile', 'language', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                    >
                      <option value="en" className="bg-slate-800">English</option>
                      <option value="es" className="bg-slate-800">Spanish</option>
                      <option value="fr" className="bg-slate-800">French</option>
                      <option value="de" className="bg-slate-800">German</option>
                      <option value="ja" className="bg-slate-800">Japanese</option>
                    </select>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        New Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Notifications */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Email Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Enable Email Notifications', icon: Mail },
                        { key: 'dueTodayReminders', label: 'Tasks Due Today', icon: Clock },
                        { key: 'dueTomorrowReminders', label: 'Tasks Due Tomorrow', icon: Calendar },
                        { key: 'overdueReminders', label: 'Overdue Tasks', icon: AlertTriangle },
                        { key: 'weeklyDigest', label: 'Weekly Summary', icon: BarChart3 }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-4 h-4 text-white/60" />
                            <span className="text-white/80">{item.label}</span>
                          </div>
                          <button
                            onClick={() => updateSettings('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-blue-500' : 'bg-white/20'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Push Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: 'push', label: 'Enable Push Notifications' },
                        { key: 'sound', label: 'Notification Sounds' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-white/80">{item.label}</span>
                          <button
                            onClick={() => updateSettings('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-blue-500' : 'bg-white/20'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.notifications.reminderTime}
                        onChange={(e) => updateSettings('notifications', 'reminderTime', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Theme Settings */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Theme
                    </h4>
                    <div className="space-y-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => updateSettings('appearance', 'theme', theme.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            settings.appearance.theme === theme.value
                              ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300'
                              : 'hover:bg-white/10 text-white/80'
                          }`}
                        >
                          <theme.icon size={18} />
                          <span>{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Display
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Font Size
                        </label>
                        <select
                          value={settings.appearance.fontSize}
                          onChange={(e) => updateSettings('appearance', 'fontSize', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                        >
                          <option value="small" className="bg-slate-800">Small</option>
                          <option value="medium" className="bg-slate-800">Medium</option>
                          <option value="large" className="bg-slate-800">Large</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Compact Mode</span>
                        <button
                          onClick={() => updateSettings('appearance', 'compactMode', !settings.appearance.compactMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.appearance.compactMode ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Animations</span>
                        <button
                          onClick={() => updateSettings('appearance', 'animations', !settings.appearance.animations)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.appearance.animations ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.appearance.animations ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy & Data
                  </h4>
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'analytics', 
                        label: 'Usage Analytics', 
                        description: 'Help improve TaskFlow by sharing anonymous usage data'
                      },
                      { 
                        key: 'crashReports', 
                        label: 'Crash Reports', 
                        description: 'Automatically send crash reports to help fix bugs'
                      },
                      { 
                        key: 'dataSharing', 
                        label: 'Data Sharing', 
                        description: 'Share data with third-party services for enhanced features'
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{item.label}</h5>
                          <p className="text-white/60 text-sm mt-1">{item.description}</p>
                        </div>
                        <button
                          onClick={() => updateSettings('privacy', item.key, !settings.privacy[item.key as keyof typeof settings.privacy])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                            settings.privacy[item.key as keyof typeof settings.privacy] ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.privacy[item.key as keyof typeof settings.privacy] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Settings */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Performance
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Auto Save</span>
                        <button
                          onClick={() => updateSettings('advanced', 'autoSave', !settings.advanced.autoSave)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.advanced.autoSave ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.advanced.autoSave ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.advanced.backupFrequency}
                          onChange={(e) => updateSettings('advanced', 'backupFrequency', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                        >
                          <option value="daily" className="bg-slate-800">Daily</option>
                          <option value="weekly" className="bg-slate-800">Weekly</option>
                          <option value="monthly" className="bg-slate-800">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Maximum Tasks
                        </label>
                        <input
                          type="number"
                          value={settings.advanced.maxTasks}
                          onChange={(e) => updateSettings('advanced', 'maxTasks', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white"
                          min="100"
                          max="10000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Data Management
                    </h4>
                    <div className="space-y-3">
                      <button
                        onClick={handleExportData}
                        className="w-full flex items-center space-x-3 p-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Download size={18} />
                        <span>Export Data</span>
                      </button>

                      <label className="w-full flex items-center space-x-3 p-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors cursor-pointer">
                        <Upload size={18} />
                        <span>Import Data</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={handleClearData}
                        className="w-full flex items-center space-x-3 p-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={18} />
                        <span>Clear All Data</span>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white/80">Debug Mode</span>
                          <HelpCircle size={16} className="text-white/40" />
                        </div>
                        <button
                          onClick={() => updateSettings('advanced', 'debugMode', !settings.advanced.debugMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.advanced.debugMode ? 'bg-orange-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.advanced.debugMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;