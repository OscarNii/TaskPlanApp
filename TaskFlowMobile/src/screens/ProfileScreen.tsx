import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
          Profile
        </Text>
      </View>

      {/* Profile Info */}
      <View style={[styles.profileSection, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name ? getInitials(profile.name) : 'U'}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
          {profile?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={toggleTheme}
        >
          <View style={styles.settingLeft}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={isDark ? '#FFFFFF' : '#1F2937'}
            />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Notifications
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Help & Support
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle-outline" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              About
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 32,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  settingsSection: {
    margin: 20,
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutSection: {
    margin: 20,
    marginTop: 'auto',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default ProfileScreen;