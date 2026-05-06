import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import SideTab, { SideTabItem } from './SideTab';
import BottomTab, { BottomTabItem } from './BottomTab';
import { COLORS } from '../../constants/colors';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  sideTabItems?: SideTabItem[];
  bottomTabItems?: BottomTabItem[];
  activeBottomTabKey?: string;
  onSideTabPress?: (key: string) => void;
  onBottomTabPress?: (key: string) => void;
  onLogout?: () => void;
  isOnline?: boolean;
}

const defaultSideTabs: SideTabItem[] = [
  { key: 'daily-reports', label: 'Daily Reports', icon: 'bar-chart' },
  { key: 'settlements', label: 'Settlements & Payouts', icon: 'account-balance-wallet' },
  { key: 'counter-display', label: 'Counter Display', icon: 'tv' },
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
  sideTabItems = defaultSideTabs,
  bottomTabItems = defaultBottomTabs,
  activeBottomTabKey = 'dashboard',
  onSideTabPress,
  onBottomTabPress,
  onLogout,
  isOnline = true,
}) => {
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const bottomPadding = useMemo(() => Math.max(8, insets.bottom), [insets.bottom]);

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top }}>
        <Header 
          title={title} 
          onMenuPress={() => setIsSideTabOpen(true)} 
          onLogout={onLogout}
          isOnline={isOnline}
        />
      </View>

      <View style={styles.content}>{children}</View>

      <View style={{ paddingBottom: bottomPadding }}>
        <BottomTab
          items={bottomTabItems}
          activeKey={activeBottomTabKey}
          onItemPress={onBottomTabPress}
        />
      </View>

      <SideTab
        visible={isSideTabOpen}
        items={sideTabItems}
        activeKey={activeBottomTabKey}
        onItemPress={onSideTabPress}
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
