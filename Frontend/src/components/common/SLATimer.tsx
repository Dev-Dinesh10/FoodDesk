/**
 * @file src/components/common/SLATimer.tsx
 * @description Timer component that turns red when SLA is breached.
 */

import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface Props {
  initialSeconds: number;
}

export const SLATimer = ({ initialSeconds }: Props) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isBreached = seconds <= 0;

  return (
    <Text style={[styles.text, isBreached && styles.breached]}>
      {isBreached ? 'SLA BREACHED' : `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  breached: {
    color: COLORS.error,
  },
});
