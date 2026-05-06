/**
 * @file src/components/common/Badge.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface Props {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'primary';
}

export const Badge = ({ label, type = 'primary' }: Props) => (
  <View style={[styles.badge, { backgroundColor: type === 'primary' ? COLORS.primaryLight : COLORS[type] + '20' }]}>
    <Text style={[styles.text, { color: type === 'primary' ? COLORS.primary : COLORS[type] }]}>
      {label.toUpperCase()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
