import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import LiveOrderCard, { OrderStatus } from '../../components/live/LiveOrderCard';

const { width } = Dimensions.get('window');

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
  const [activeTab, setActiveTab] = useState<OrderStatus>('INCOMING');
  const scrollRef = useRef<ScrollView>(null);

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

  const counts = {
    INCOMING: orders.filter(o => o.status === 'INCOMING').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY: orders.filter(o => o.status === 'READY').length,
  };

  const TABS = [
    { key: 'INCOMING' as OrderStatus, label: 'Incoming', color: '#0077B6' },
    { key: 'PREPARING' as OrderStatus, label: 'Preparing', color: '#F59E0B' },
    { key: 'READY' as OrderStatus, label: 'Ready', color: '#10B981' },
  ];

  return (
    <View style={styles.container}>
      {/* Filter Chips (Pill Shaped - Matching Menu Design) */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab.key} 
              style={[
                styles.filterChip, 
                activeTab === tab.key && styles.activeFilterChip
              ]}
              onPress={() => {
                setActiveTab(tab.key);
                const index = TABS.findIndex(t => t.key === tab.key);
                scrollRef.current?.scrollTo({ x: index * width, animated: true });
              }}
            >
              <Text style={[
                styles.filterText, 
                activeTab === tab.key && styles.activeFilterText
              ]}>
                {tab.label} ({counts[tab.key]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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

      {/* Active List (Swipeable) */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveTab(TABS[page].key);
        }}
      >
        {TABS.map(tab => (
          <View style={{ width: width }} key={tab.key}>
            <FlatList
              data={orders.filter(o => o.status === tab.key)}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <LiveOrderCard
                  token={item.token}
                  employeeName={item.employeeName}
                  items={item.items}
                  slotTime={item.slotTime}
                  status={item.status}
                  slaProgress={item.slaProgress}
                  onAccept={() => updateStatus(item.id, 'PREPARING')}
                  onMarkReady={() => updateStatus(item.id, 'READY')}
                  onReject={() => setOrders(prev => prev.filter(o => o.id !== item.id))}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialIcons name="done-all" size={64} color="#E2E8F0" />
                  <Text style={styles.emptyText}>No {tab.label.toLowerCase()} orders at the moment</Text>
                </View>
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 10,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: COLORS.white,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5ED',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: FONT_WEIGHT.medium,
  },
  activeFilterText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  actionBar: {
    backgroundColor: COLORS.white,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
  },
  batchBtnText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    textTransform: 'capitalize',
  },
});

export default LiveOrdersScreen;
