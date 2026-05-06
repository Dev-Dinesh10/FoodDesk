/**
 * @file src/components/common/StatusDot.tsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  status: 'success' | 'warning' | 'error' | 'info';
  size?: number;
}

export const StatusDot = ({ status, size = 12 }: Props) => (
  <View 
    style={[
      styles.dot, 
      { 
        backgroundColor: COLORS[status], 
        width: size, 
        height: size, 
        borderRadius: size / 2 
      }
    ]} 
  />
);

const styles = StyleSheet.create({
  dot: {
    marginRight: 8,
  },
});
