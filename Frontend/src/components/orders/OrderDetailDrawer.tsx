/**
 * @file src/components/orders/OrderDetailDrawer.tsx
 * @description Detailed view of an order with item checklist.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { Order } from '../../types';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Badge } from '../common/Badge';

interface Props {
  order: Order;
  onUpdateStatus: (status: any) => void;
  onClose: () => void;
}

export const OrderDetailDrawer = ({ order, onUpdateStatus, onClose }: Props) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={TYPOGRAPHY.h2}>Order #{order.tokenNumber}</Text>
      <Badge label={order.status} type="warning" />
    </View>

    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
      {order.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Checkbox status={item.fulfilled ? 'checked' : 'unchecked'} />
          <View style={styles.itemInfo}>
            <Text style={TYPOGRAPHY.body}>{item.name}</Text>
            <Text style={TYPOGRAPHY.caption}>Qty: {item.quantity}</Text>
          </View>
        </View>
      ))}
    </ScrollView>

    <View style={styles.footer}>
      <Button 
        mode="contained" 
        onPress={() => onUpdateStatus('ready')}
        style={styles.actionButton}
        buttonColor={COLORS.success}
      >
        Mark as Ready
      </Button>
      <Button mode="text" onPress={onClose} textColor={COLORS.textSecondary}>
        Close
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    marginLeft: SPACING.sm,
  },
  footer: {
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    marginBottom: SPACING.md,
    borderRadius: 8,
  },
});
