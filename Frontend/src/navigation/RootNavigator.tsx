import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import StackNavigator from './StackNavigator';
import { AuthProvider, useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

// Re-export useAuth so any existing imports from this file still work
export { useAuth };

function AppNavigation() {
  const { isLoggedIn, onLogin } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLoginSuccess={onLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={StackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
