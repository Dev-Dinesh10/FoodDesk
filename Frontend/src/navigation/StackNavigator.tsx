import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import LiveOrdersScreen from '../screens/liveorders/LiveOrdersScreen';
import ScanScreen from '../screens/scan/ScanScreen';
import PreOrdersScreen from '../screens/preorders/PreOrdersScreen';
import MenuListScreen from '../screens/menu/MenuListScreen';
import DailyReportScreen from '../screens/reports/DailyReportScreen';
import SettlementsScreen from '../screens/settlements/SettlementsScreen';
import CounterDisplayScreen from '../screens/counter/CounterDisplayScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SlotsScreen from '../screens/slots/SlotsScreen';
import MonthlyActivityScreen from '../screens/monthly/MonthlyActivityScreen';
import KOTBatchesScreen from '../screens/kot/KOTBatchesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type AppStackParamList = {
  Dashboard: undefined;
  LiveOrders: undefined;
  Scan: undefined;
  PreOrders: undefined;
  Menu: undefined;
  DailyReports: undefined;
  Settlements: undefined;
  CounterDisplay: undefined;
  Settings: undefined;
  Slots: undefined;
  MonthlyActivity: undefined;
  KOTBatches: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="LiveOrders" component={LiveOrdersScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="PreOrders" component={PreOrdersScreen} />
      <Stack.Screen name="Menu" component={MenuListScreen} />
      <Stack.Screen name="DailyReports" component={DailyReportScreen} />
      <Stack.Screen name="Settlements" component={SettlementsScreen} />
      <Stack.Screen name="CounterDisplay" component={CounterDisplayScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Slots" component={SlotsScreen} />
      <Stack.Screen name="MonthlyActivity" component={MonthlyActivityScreen} />
      <Stack.Screen name="KOTBatches" component={KOTBatchesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
