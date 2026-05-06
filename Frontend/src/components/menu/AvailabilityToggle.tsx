/**
 * @file src/components/menu/AvailabilityToggle.tsx
 */

import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface Props {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const AvailabilityToggle = ({ label, isEnabled, onToggle }: Props) => (
  <View style={styles.container}>
    <Text style={TYPOGRAPHY.body}>{label}</Text>
    <Switch
      value={isEnabled}
      onValueChange={onToggle}
      trackColor={{ true: COLORS.success, false: COLORS.border }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
});
