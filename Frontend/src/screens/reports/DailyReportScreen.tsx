import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart, ChartGroup, ChartBar, ChartLabel } from 'victory-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import Layout from '../../components/layout/Layout';

const { width } = Dimensions.get('window');

const DailyReportScreen = () => {
  const [selectedDate, setSelectedDate] = useState('Today, May 06');
  
  // Mock Data
  const summary = [
    { label: 'Total Orders', value: '142', prev: '138', icon: 'list-alt', color: '#6366F1' },
    { label: 'Collected', value: '128', prev: '122', icon: 'check-circle', color: '#10B981' },
    { label: 'No-Show', value: '10', prev: '4', icon: 'event-busy', color: '#EF4444' },
    { label: 'Cancelled', value: '4', prev: '12', icon: 'cancel', color: '#64748B' },
    { label: 'Net Revenue', value: '₹12,450', prev: '₹11,200', icon: 'payments', color: '#F59E0B' },
  ];

  const itemPerformance = [
    { name: 'Dal Rice', ordered: 45, collected: 40, noshow: 5, revenue: 4800 },
    { name: 'Chicken Biryani', ordered: 32, collected: 30, noshow: 2, revenue: 7200 },
    { name: 'Veg Thali', ordered: 28, collected: 25, noshow: 3, revenue: 3080 },
    { name: 'Salad Bowl', ordered: 15, collected: 15, noshow: 0, revenue: 1350 },
  ];

  const chartData = [
    { slot: '12:00', orders: 45 },
    { slot: '12:15', orders: 32 },
    { slot: '12:30', orders: 28 },
    { slot: '12:45', orders: 22 },
    { slot: '13:00', orders: 15 },
  ];

  const noShowRate = 7.04; // (10 / 142) * 100

  return (
    <Layout title="Daily Reports" activeBottomTabKey="daily-reports">
    <View style={styles.container}>
      {/* Date Selector */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.dateSelector}>
            <MaterialIcons name="event" size={20} color={COLORS.primary} />
            <Text style={styles.dateText}>{selectedDate}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshBtn}>
            <MaterialIcons name="refresh" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* High Wastage Alert */}
          {noShowRate > 5 && (
            <View style={styles.alertBanner}>
              <MaterialIcons name="warning" size={20} color="#92400E" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>High wastage today</Text>
                <Text style={styles.alertDesc}>Consider reducing 12:00 PM slot capacity to minimize no-shows.</Text>
              </View>
            </View>
          )}

          {/* Summary Grid */}
          <View style={styles.summaryGrid}>
            {summary.map((item, idx) => (
              <View key={idx} style={[styles.summaryCard, item.label === 'Net Revenue' && styles.fullWidthCard]}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  <MaterialIcons name={item.icon as any} size={18} color={item.color} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                  <Text style={styles.comparisonText}>
                    vs {item.prev} yesterday
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* SLA & No-Show Insights */}
          <View style={styles.insightRow}>
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>SLA Performance</Text>
              <Text style={styles.insightValue}>94%</Text>
              <Text style={styles.insightSub}>Ready within target time</Text>
            </View>
            <View style={[styles.insightCard, { marginLeft: SPACING.md }]}>
              <Text style={styles.insightTitle}>No-Show Rate</Text>
              <Text style={[styles.insightValue, { color: COLORS.error }]}>{noShowRate.toFixed(1)}%</Text>
              <Text style={styles.insightSub}>10 orders uncollected</Text>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orders by Time Slot</Text>
            <View style={styles.chartContainer}>
              {/* Simplified manual bar chart for cross-platform reliability */}
              <View style={styles.barChart}>
                {chartData.map((d, i) => (
                  <View key={i} style={styles.barWrapper}>
                    <View style={styles.barBackground}>
                      <View style={[styles.barFill, { height: (d.orders / 50) * 120 }]} />
                    </View>
                    <Text style={styles.barLabel}>{d.slot}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Item Performance Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Performance</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Item</Text>
                <Text style={styles.th}>Ord</Text>
                <Text style={styles.th}>Col</Text>
                <Text style={styles.th}>N/S</Text>
                <Text style={[styles.th, { textAlign: 'right' }]}>Rev</Text>
              </View>
              {itemPerformance.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 2, fontWeight: FONT_WEIGHT.bold }]}>{item.name}</Text>
                  <Text style={styles.td}>{item.ordered}</Text>
                  <Text style={styles.td}>{item.collected}</Text>
                  <Text style={[styles.td, item.noshow > 0 && { color: COLORS.error, fontWeight: FONT_WEIGHT.bold }]}>
                    {item.noshow}
                  </Text>
                  <Text style={[styles.td, { textAlign: 'right', color: COLORS.primary, fontWeight: FONT_WEIGHT.bold }]}>
                    ₹{item.revenue}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Export Buttons */}
          <View style={styles.exportRow}>
            <TouchableOpacity style={styles.exportBtn}>
              <MaterialIcons name="picture-as-pdf" size={20} color={COLORS.textPrimary} />
              <Text style={styles.exportBtnText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn}>
              <MaterialIcons name="description" size={20} color={COLORS.textPrimary} />
              <Text style={styles.exportBtnText}>Download CSV</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
    </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: '#92400E',
  },
  alertDesc: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fullWidthCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 0,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  comparisonText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  insightRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  insightCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#10B981',
    marginVertical: 4,
  },
  insightSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    height: 150,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    width: 24,
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  th: {
    flex: 1,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  td: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  exportRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: 40,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
});

export default DailyReportScreen;

