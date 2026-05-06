import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Layout from '../components/layout/Layout';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import LiveOrdersScreen from '../screens/liveorders/LiveOrdersScreen';
import ScanScreen from '../screens/scan/ScanScreen';
import PreOrdersScreen from '../screens/preorders/PreOrdersScreen';
import MenuListScreen from '../screens/menu/MenuListScreen';
import DailyReportScreen from '../screens/reports/DailyReportScreen';
import SettlementsScreen from '../screens/settlements/SettlementsScreen';
import CounterDisplayScreen from '../screens/counter/CounterDisplayScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

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
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const bottomTabRouteMap: Record<string, keyof AppStackParamList> = {
  dashboard: 'Dashboard',
  'live-orders': 'LiveOrders',
  scan: 'Scan',
  'pre-orders': 'PreOrders',
  menu: 'Menu',
};

const sideTabRouteMap: Record<string, keyof AppStackParamList | 'logout'> = {
  'daily-reports': 'DailyReports',
  settlements: 'Settlements',
  'counter-display': 'CounterDisplay',
  settings: 'Settings',
  logout: 'logout',
};

function withAppLayout(
  routeKey: string,
  title: string,
  ScreenComponent: React.ComponentType,
  onLogout: () => void,
): React.FC<{ navigation: any }> {
  return ({ navigation }) => {
    return (
      <Layout
        title={title}
        activeBottomTabKey={routeKey}
        onLogout={onLogout}
        onBottomTabPress={(key) => {
          const targetRoute = bottomTabRouteMap[key];
          if (targetRoute) {
            navigation.navigate(targetRoute);
          }
        }}
        onSideTabPress={async (key) => {
          const targetRoute = sideTabRouteMap[key];
          if (!targetRoute) {
            return;
          }
          if (targetRoute === 'logout') {
            onLogout();
            return;
          }
          navigation.navigate(targetRoute);
        }}
      >
        <ScreenComponent />
      </Layout>
    );
  };
}

interface AppNavigatorProps {
  onLogout: () => void;
}

export default function AppNavigator({ onLogout }: AppNavigatorProps) {
  const DashboardWithLayout = withAppLayout('dashboard', 'Dashboard', DashboardScreen, onLogout);
  const LiveOrdersWithLayout = withAppLayout('live-orders', 'Live Orders', LiveOrdersScreen, onLogout);
  const ScanWithLayout = withAppLayout('scan', 'Scan', ScanScreen, onLogout);
  const PreOrdersWithLayout = withAppLayout('pre-orders', 'Pre-Orders', PreOrdersScreen, onLogout);
  const MenuWithLayout = withAppLayout('menu', 'Menu', MenuListScreen, onLogout);
  const DailyReportsWithLayout = withAppLayout('daily-reports', 'Daily Reports', DailyReportScreen, onLogout);
  const SettlementsWithLayout = withAppLayout('settlements', 'Settlements & Payouts', SettlementsScreen, onLogout);
  const CounterDisplayWithLayout = withAppLayout('counter-display', 'Counter Display Mode', CounterDisplayScreen, onLogout);
  const SettingsWithLayout = withAppLayout('settings', 'Settings', SettingsScreen, onLogout);

  return (
    <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardWithLayout} />
      <Stack.Screen name="LiveOrders" component={LiveOrdersWithLayout} />
      <Stack.Screen name="Scan" component={ScanWithLayout} />
      <Stack.Screen name="PreOrders" component={PreOrdersWithLayout} />
      <Stack.Screen name="Menu" component={MenuWithLayout} />
      <Stack.Screen name="DailyReports" component={DailyReportsWithLayout} />
      <Stack.Screen name="Settlements" component={SettlementsWithLayout} />
      <Stack.Screen name="CounterDisplay" component={CounterDisplayWithLayout} />
      <Stack.Screen name="Settings" component={SettingsWithLayout} />
    </Stack.Navigator>
  );
}
