/**
 * @file src/components/orders/KanbanColumn.tsx
 * @description Vertical column for specific order statuses (e.g., Preparing).
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Order } from '../../types';
import { OrderCard } from './OrderCard';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface Props {
  title: string;
  orders: Order[];
  onOrderPress: (orderId: string) => void;
}

export const KanbanColumn = ({ title, orders, onOrderPress }: Props) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{orders.length}</Text>
      </View>
    </View>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard order={item} onPress={() => onOrderPress(item.id)} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    backgroundColor: '#F1F5F9', // Slightly darker than background for contrast
    borderRadius: 12,
    padding: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
});
