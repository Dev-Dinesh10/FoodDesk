import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import LiveOrderCard, { OrderStatus } from '../../components/live/LiveOrderCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.85; // Wide enough for readability, shows peek of next

interface Order {
  id: string;
  token: string;
  employeeName: string;
  items: string[];
  slotTime: string;
  status: OrderStatus;
  slaProgress: number;
}

const INITIAL_ORDERS: Order[] = [
  { id: '1', token: 'A-047', employeeName: 'Rahul S.', items: ['Dal Rice', 'Extra Roti'], slotTime: '12:15 PM', status: 'INCOMING', slaProgress: 0.2 },
  { id: '2', token: 'A-048', employeeName: 'Priya K.', items: ['Chicken Biryani'], slotTime: '12:15 PM', status: 'INCOMING', slaProgress: 0.1 },
  { id: '3', token: 'A-045', employeeName: 'Amit G.', items: ['Veg Thali'], slotTime: '12:00 PM', status: 'PREPARING', slaProgress: 0.85 },
  { id: '4', token: 'A-044', employeeName: 'Sneha L.', items: ['Paneer Masala', 'Butter Nan'], slotTime: '12:00 PM', status: 'PREPARING', slaProgress: 0.6 },
  { id: '5', token: 'A-042', employeeName: 'Vikram', items: ['Salad', 'Fruit Bowl'], slotTime: '11:45 AM', status: 'READY', slaProgress: 1.05 },
];

const LiveOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'BOARD'>('KANBAN');

  const updateStatus = (id: string, newStatus: OrderStatus | 'COLLECTED') => {
    if (newStatus === 'COLLECTED') {
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const batchAction = (targetStatus: OrderStatus, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.status === targetStatus ? { ...o, status: newStatus } : o));
  };

  const renderColumn = (title: string, status: OrderStatus, icon: string, color: string) => {
    const colOrders = orders.filter(o => o.status === status);

    return (
      <View style={styles.column}>
        <View style={[styles.columnHeader, { borderTopColor: color }]}>
          <View style={styles.columnTitleRow}>
            <MaterialIcons name={icon as any} size={20} color={color} />
            <Text style={styles.columnTitle}>{title}</Text>
            <View style={[styles.countBadge, { backgroundColor: color }]}>
              <Text style={styles.countText}>{colOrders.length}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.columnScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.columnContent}
        >
          {colOrders.length > 0 ? (
            colOrders.map(order => (
              <LiveOrderCard
                key={order.id}
                token={order.token}
                employeeName={order.employeeName}
                items={order.items}
                slotTime={order.slotTime}
                status={order.status}
                slaProgress={order.slaProgress}
                onStartPrep={() => updateStatus(order.id, 'PREPARING')}
                onMarkReady={() => updateStatus(order.id, 'READY')}
              />
            ))
          ) : (
            <View style={styles.emptyCol}>
              <MaterialIcons name="done-all" size={48} color="#E2E8F0" />
              <Text style={styles.emptyText}>All caught up!</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Legend & Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Live Orders</Text>
          <Text style={styles.subtitle}>Counter View • {orders.length} Active</Text>
        </View>
        <TouchableOpacity
          style={styles.modeToggle}
          onPress={() => setViewMode(viewMode === 'KANBAN' ? 'BOARD' : 'KANBAN')}
        >
          <MaterialIcons
            name={viewMode === 'KANBAN' ? 'fullscreen' : 'view-week'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Batch Action Bar */}
      <View style={styles.actionBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll}>
          <TouchableOpacity
            style={styles.batchBtn}
            onPress={() => batchAction('INCOMING', 'PREPARING')}
          >
            <MaterialIcons name="play-arrow" size={16} color={COLORS.textPrimary} />
            <Text style={styles.batchBtnText}>Mark all preparing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.batchBtn}
            onPress={() => batchAction('PREPARING', 'READY')}
          >
            <MaterialIcons name="check-circle" size={16} color={COLORS.textPrimary} />
            <Text style={styles.batchBtnText}>Mark all ready</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Kanban Board */}
      <ScrollView
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boardContent}
        snapToInterval={COLUMN_WIDTH + SPACING.md}
        decelerationRate="fast"
      >
        {renderColumn('INCOMING', 'INCOMING', 'downloading', '#0077B6')}
        {renderColumn('PREPARING', 'PREPARING', 'restaurant', '#F59E0B')}
        {renderColumn('READY', 'READY', 'shopping-bag', '#10B981')}
      </ScrollView>

      {/* Footer Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#0077B6' }]} /><Text style={styles.legendText}>New</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#F59E0B' }]} /><Text style={styles.legendText}>Cooking</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Ready</Text></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modeToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5ED',
  },
  actionBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  actionScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  batchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  batchBtnText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  boardContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  column: {
    width: COLUMN_WIDTH,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    overflow: 'hidden',
  },
  columnHeader: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  columnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  columnScroll: {
    flex: 1,
  },
  columnContent: {
    padding: SPACING.md,
  },
  emptyCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
});

export default LiveOrdersScreen;
