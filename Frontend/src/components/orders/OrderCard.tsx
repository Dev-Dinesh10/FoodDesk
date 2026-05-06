/**
 * @file src/components/orders/OrderCard.tsx
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../../types';
import { COLORS } from '../../constants/colors';
import { SPACING, TOUCH_TARGET } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { SLATimer } from '../common/SLATimer';

interface Props {
  order: Order;
  onPress: () => void;
}

export const OrderCard = ({ order, onPress }: Props) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.header}>
      <Text style={styles.token}>#{order.tokenNumber}</Text>
      <SLATimer initialSeconds={order.slaTimer} />
    </View>
    <Text style={styles.customer}>{order.employeeName}</Text>
    <Text style={styles.items}>{order.items.length} Items • {order.slotTime}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    minHeight: TOUCH_TARGET.min,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  token: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  customer: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  items: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
