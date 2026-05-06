/**
 * @file src/components/common/OfflineBanner.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';

export const OfflineBanner = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Offline Mode - Data is being cached locally</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.warning,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textOnPrimary,
  },
});
