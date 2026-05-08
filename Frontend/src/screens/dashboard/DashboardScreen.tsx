import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/StackNavigator';
import Layout from '../../components/layout/Layout';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import MetricCard from '../../components/dashboard/MetricCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [isOffline, setIsOffline] = useState(false);
  const hasOrders = true;
  const showSlaAlert = true;

  const recentActivities = [
    { action: 'Order #A-045 accepted', timestamp: '10:12 AM' },
    { action: 'Order #A-046 moved to preparing', timestamp: '10:15 AM' },
    { action: 'Item marked sold out: Lemon Rice', timestamp: '10:18 AM' },
    { action: 'Order #A-044 collected', timestamp: '10:20 AM' },
  ];

  return (
    <Layout title="Dashboard" activeBottomTabKey="dashboard">
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topInfoBar}>
        <View>
          <Text style={styles.vendorName}>FreshBowl Kitchen</Text>
          <Text style={styles.vendorMeta}>Counter 2 · {new Date().toDateString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: isOffline ? COLORS.textSecondary : '#10B981' }}>
            {isOffline ? 'Offline' : 'Online'}
          </Text>
          <Switch
            value={!isOffline}
            onValueChange={(val) => setIsOffline(!val)}
            trackColor={{ false: '#CBD5E1', true: '#10B981' }}
            thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
            style={{ transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }] }}
          />
        </View>
      </View>

      {isOffline ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>Working offline - showing cached data</Text>
        </View>
      ) : null}

      {showSlaAlert ? (
        <View style={styles.slaBanner}>
          <Text style={styles.slaBannerText}>
            SLA alert: Order #A-047 prep time exceeded by 4 min
          </Text>
        </View>
      ) : null}

      <View style={styles.statsGrid}>
        <MetricCard
          label="Today's Pre-Orders"
          value="452 confirmed"
          iconName="assignment"
        />
        <MetricCard
          label="Live Orders Pending"
          value="12 in queue"
          iconName="timer"
        />
        <MetricCard
          label="Sold Out Items"
          value="2 flagged"
          iconName="block"
          iconColor={COLORS.error}
        />
        <MetricCard
          label="Today's Revenue"
          value="₹67,800"
          iconName="payments"
          iconColor={COLORS.success}
        />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        <QuickActionButton
          label="Slots"
          onPress={() => navigation.navigate('Slots')}
        />
        <View style={styles.actionGap} />
        <QuickActionButton
          label="Daily Report"
          onPress={() => navigation.navigate('DailyReports')}
        />
        <View style={styles.actionGap} />
        <QuickActionButton
          label="Counter"
          onPress={() => navigation.navigate('CounterDisplay')}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        {hasOrders ? (
          recentActivities.map((activity, index) => (
            <ActivityItem
              key={`${activity.action}-${index}`}
              action={activity.action}
              timestamp={activity.timestamp}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            No pre-orders for today. Live kitchen opens at 11:30 AM.
          </Text>
        )}
      </View>
    </ScrollView>
    </Layout>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.max,
  },
  topInfoBar: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  vendorMeta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  offlineBanner: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    padding: SPACING.sm,
  },
  offlineBannerText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  slaBanner: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.lockedBannerBg,
    borderWidth: 1,
    borderColor: COLORS.lockedBannerBorder,
    borderRadius: 10,
    padding: SPACING.sm,
  },
  slaBannerText: {
    color: COLORS.lockedBannerText,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  statsGrid: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: TYPOGRAPHY.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  actionGap: {
    width: SPACING.xs,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  emptyText: {
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  onlineBtn: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  offlineBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  toggleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineDot: {
    backgroundColor: COLORS.success,
  },
  offlineDot: {
    backgroundColor: COLORS.error,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});