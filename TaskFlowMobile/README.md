# TaskFlow Mobile

A beautiful, feature-rich task management app for iOS and Android built with React Native and Expo.

## Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- 📱 **Cross-Platform**: Native iOS and Android apps
- 🎨 **Beautiful UI**: Modern design with dark/light theme support
- 📊 **Dashboard**: Overview of your productivity with stats
- 🏷️ **Projects & Tags**: Organize tasks by projects and tags
- ⏰ **Due Dates**: Set and track task deadlines
- 📋 **Subtasks**: Break down complex tasks
- 🔔 **Notifications**: Stay on top of your tasks
- 🔐 **Secure**: Local data storage with authentication
- 🌙 **Dark Mode**: Easy on the eyes

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd TaskFlowMobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## Project Structure

```
TaskFlowMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # App screens
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Key Features

### Authentication
- Secure login/signup with demo account
- Local data storage with AsyncStorage
- Session management

### Task Management
- Create tasks with title, description, priority
- Set due dates and assign to projects
- Add subtasks for complex workflows
- Mark tasks as complete

### Dashboard
- Personalized greeting based on time of day
- Task completion statistics
- Quick overview of today's tasks
- High priority task highlights

### Projects
- Organize tasks by projects
- Color-coded project system
- Project-based filtering

### Responsive Design
- Optimized for both phones and tablets
- Dark/light theme support
- Native iOS and Android UI patterns

## Building for Production

### Android

1. Configure your app signing:
   ```bash
   eas build:configure
   ```

2. Build the APK/AAB:
   ```bash
   npm run build:android
   ```

### iOS

1. Configure your Apple Developer account
2. Build the IPA:
   ```bash
   npm run build:ios
   ```

## Publishing

### Google Play Store
```bash
npm run submit:android
```

### Apple App Store
```bash
npm run submit:ios
```

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **Expo Linear Gradient**: Beautiful gradients
- **React Native Vector Icons**: Icon library
- **Expo Notifications**: Push notifications

## Demo Account

For testing purposes, use these credentials:
- **Email**: demo@taskflow.com
- **Password**: demo123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@taskflow.com or create an issue in the repository.