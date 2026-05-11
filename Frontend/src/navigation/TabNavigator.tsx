import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AppStackParamList } from './StackNavigator';

export const bottomTabRouteMap: Record<string, keyof AppStackParamList> = {
  dashboard: 'Dashboard',
  'live-orders': 'LiveOrders',
  scan: 'Scan',
  'pre-orders': 'PreOrders',
  menu: 'Menu',
};

export const sideTabRouteMap: Record<string, keyof AppStackParamList | 'logout'> = {
  'monthly-activity': 'MonthlyActivity',
  'kot-batches': 'KOTBatches',
  'daily-reports': 'DailyReports',
  settlements: 'Settlements',
  'counter-display': 'CounterDisplay',
  slots: 'Slots',
  profile: 'Profile',
  settings: 'Settings',
  logout: 'logout',
};

export const useTabNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { onLogout } = useAuth();

  const handleBottomTabPress = (key: string) => {
    const targetRoute = bottomTabRouteMap[key];
    if (targetRoute) {
      navigation.navigate(targetRoute);
    }
  };

  const handleSideTabPress = (key: string) => {
    const targetRoute = sideTabRouteMap[key];
    if (!targetRoute) return;
    if (targetRoute === 'logout') {
      onLogout();
      return;
    }
    navigation.navigate(targetRoute);
  };

  return { handleBottomTabPress, handleSideTabPress };
};
