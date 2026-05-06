import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

export interface BottomTabItem {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isPrimary?: boolean;
}

interface BottomTabProps {
  items: BottomTabItem[];
  activeKey: string;
  onItemPress?: (key: string) => void;
}

const BottomTab: React.FC<BottomTabProps> = ({ items, activeKey, onItemPress }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = activeKey === item.key;
        const isPrimary = Boolean(item.isPrimary);
        return (
          <Pressable key={item.key} style={styles.item} onPress={() => onItemPress?.(item.key)}>
            <View style={[styles.iconWrap, isPrimary ? styles.primaryWrap : null]}>
              <MaterialIcons
                name={item.icon}
                size={isPrimary ? 28 : 20}
                color={isPrimary ? COLORS.white : isActive ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <Text style={[styles.label, isActive ? styles.activeLabel : null]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: COLORS.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    minHeight: 72,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 56,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -26,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  label: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default BottomTab;
