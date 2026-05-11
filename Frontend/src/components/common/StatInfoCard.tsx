/**
 * @file src/components/common/StatInfoCard.tsx
 * A compact, horizontally scrollable stat card used in Monthly Activity.
 * Displays a label, large numeric value, subtitle, and an icon with accent color.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

export interface StatInfoCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accentColor: string;
}

const StatInfoCard: React.FC<StatInfoCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  accentColor,
}) => (
  <View style={styles.card}>
    <View style={[styles.iconWrap, { backgroundColor: accentColor + '18' }]}>
      <MaterialIcons name={icon} size={18} color={accentColor} />
    </View>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
    <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
    <Text style={styles.subtitle} numberOfLines={1}>
      {subtitle}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 110,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
});

export default StatInfoCard;
