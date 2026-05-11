import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import SideTab, { SideTabItem } from './SideTab';
import BottomTab, { BottomTabItem } from './BottomTab';
import { COLORS } from '../../constants/colors';
import { useTabNavigation } from '../../navigation/TabNavigator';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  activeBottomTabKey?: string;
  sideTabItems?: SideTabItem[];
  bottomTabItems?: BottomTabItem[];
  /** Override default bottom-tab handler (rarely needed) */
  onBottomTabPress?: (key: string) => void;
  /** Override default side-tab handler (rarely needed) */
  onSideTabPress?: (key: string) => void;
  isOnline?: boolean;
}

const defaultSideTabs: SideTabItem[] = [
  { key: 'profile', label: 'Profile', icon: 'person' },
  { key: 'kot-batches', label: 'KOT Batches', icon: 'layers' },
  { key: 'counter-display', label: 'Counter Display', icon: 'tv' },
  { key: 'daily-reports', label: 'Daily Reports', icon: 'bar-chart' },
  { key: 'monthly-activity', label: 'Monthly Activity', icon: 'calendar-today' },
  { key: 'settlements', label: 'Settlements & Payouts', icon: 'account-balance-wallet' },
  { key: 'slots', label: 'Slots', icon: 'access-time' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
  { key: 'logout', label: 'Logout', icon: 'logout' },
];

const defaultBottomTabs: BottomTabItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'live-orders', label: 'Live Orders', icon: 'receipt-long' },
  { key: 'scan', label: 'Scan', icon: 'qr-code-scanner', isPrimary: true },
  { key: 'pre-orders', label: 'Pre-Orders', icon: 'event-note' },
  { key: 'menu', label: 'Menu', icon: 'restaurant-menu' },
];

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'FoodDesk',
  activeBottomTabKey = 'dashboard',
  sideTabItems = defaultSideTabs,
  bottomTabItems = defaultBottomTabs,
  onBottomTabPress,
  onSideTabPress,
  isOnline = true,
}) => {
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { handleBottomTabPress, handleSideTabPress } = useTabNavigation();
  const { onLogout } = useAuth();

  const bottomPadding = useMemo(() => Math.max(8, insets.bottom), [insets.bottom]);

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top }}>
        <Header
          title={title}
          onMenuPress={() => setIsSideTabOpen(true)}
          onLogout={onLogout}
        />
      </View>

      <View style={styles.content}>{children}</View>

      <View style={{ paddingBottom: bottomPadding }}>
        <BottomTab
          items={bottomTabItems}
          activeKey={activeBottomTabKey}
          onItemPress={onBottomTabPress ?? handleBottomTabPress}
        />
      </View>

      <SideTab
        visible={isSideTabOpen}
        items={sideTabItems}
        activeKey={activeBottomTabKey}
        onItemPress={onSideTabPress ?? handleSideTabPress}
        onClose={() => setIsSideTabOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
