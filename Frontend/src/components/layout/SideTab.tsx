import React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SideTabItem {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface SideTabProps {
  visible: boolean;
  items: SideTabItem[];
  activeKey?: string;
  onItemPress?: (key: string) => void;
  onClose: () => void;
}

const SideTab: React.FC<SideTabProps> = ({ visible, items, activeKey, onItemPress, onClose }) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[
        styles.drawer,
        {
          paddingTop: Math.max(insets.top, SPACING.lg),
          paddingBottom: Math.max(insets.bottom, SPACING.lg)
        }
      ]}>
        {/* Drawer Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="restaurant" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>FoodDesk</Text>
              <Text style={styles.brandSub}>Vendor Panel</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Navigation Items */}
        <View style={styles.itemsContainer}>
          {items.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.item, isActive && styles.activeItem]}
                onPress={() => {
                  onItemPress?.(item.key);
                  onClose();
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={isActive ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[styles.itemText, isActive && styles.activeItemText]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.4 — Build 42</Text>
        </View>
      </View>
    </View>
  );
};

// Internal TouchableOpacity replacement for simplicity
const TouchableOpacity = ({ children, style, onPress }: any) => (
  <Pressable style={({ pressed }) => [style, { opacity: pressed ? 0.6 : 1 }]} onPress={onPress}>
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    width: Math.min(SCREEN_WIDTH * 0.8, 300),
    backgroundColor: COLORS.white,
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    gap: 16,
  },
  activeItem: {
    backgroundColor: '#FFF5ED',
  },
  itemText: {
    fontSize: 15,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  activeItemText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default SideTab;
