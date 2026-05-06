/**
 * @file src/components/scan/ScanResultFlash.tsx
 * @description Quick visual feedback after a QR scan.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface Props {
  success: boolean;
  message: string;
}

export const ScanResultFlash = ({ success, message }: Props) => (
  <View style={[styles.container, { backgroundColor: success ? COLORS.success : COLORS.error }]}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    zIndex: 1000,
  },
  text: {
    color: '#FFF',
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
  },
});
