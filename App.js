import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import TodoScreen from './src/screens/TodoScreen';
import ProfileInfoScreen from './src/screens/ProfileInfoScreen';
import PairingScreen from './src/screens/PairingScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HomeScreen from './src/screens/HomeScreen';

// Theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Todo') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'ProfileInfo') {
            iconName = focused ? 'diamond' : 'diamond-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Lịch',
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Công việc',
        }}
      />
      <Tab.Screen
        name="ProfileInfo"
        component={ProfileInfoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond" size={size} color={color} />
          ),
          tabBarLabel: 'Thông tin',
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  const { user, loading, isPaired } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!user ? (
        // Auth screens
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : !isPaired ? (
        // Pairing screen
        <Stack.Screen
          name="Pairing"
          component={PairingScreen}
          options={{ 
            title: 'Ghép đôi',
            headerShown: false 
          }}
        />
      ) : (
        // Main app screens
        <>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Chỉnh sửa hồ sơ' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
