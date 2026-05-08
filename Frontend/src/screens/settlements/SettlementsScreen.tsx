import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import Layout from '../../components/layout/Layout';

const SettlementsScreen = () => {
  const currentPayout = {
    gross: 67800,
    commissionRate: 8,
    commission: -5424,
    gst: -977,
    net: 61399,
    expectedDate: '15th May 2026',
    status: 'PENDING',
    failedReason: null // 'bank_details_issue' for failed state
  };

  const history = [
    { id: '1', date: '01 May 2026', amount: 54200, ref: 'TXN_99218', status: 'PAID' },
    { id: '2', date: '15 Apr 2026', amount: 48900, ref: 'TXN_98742', status: 'PAID' },
    { id: '3', date: '01 Apr 2026', amount: 12400, ref: 'TXN_97611', status: 'FAILED', reason: 'Invalid Bank Details' },
    { id: '4', date: '15 Mar 2026', amount: 55600, ref: 'TXN_96500', status: 'PAID' },
  ];

  const renderHeader = () => (
    <View>
      {/* Tier Info Header */}
      <View style={styles.tierHeader}>
        <View style={styles.tierBadge}>
          <MaterialIcons name="trending-up" size={14} color={COLORS.primary} />
          <Text style={styles.tierText}>Growth Plan — 8% commission</Text>
        </View>
      </View>

      {/* Failed Payout Alert */}
      {currentPayout.failedReason && (
        <View style={styles.errorAlert}>
          <MaterialIcons name="error-outline" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>Last payout failed — update your bank details</Text>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.error} />
        </View>
      )}

      {/* Main Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Current Period Payout</Text>

        <View style={styles.financialRow}>
          <Text style={styles.finLabel}>Gross Sales</Text>
          <Text style={styles.finValue}>₹{currentPayout.gross.toLocaleString()}</Text>
        </View>
        <View style={styles.financialRow}>
          <Text style={styles.finLabel}>Commission ({currentPayout.commissionRate}%)</Text>
          <Text style={[styles.finValue, { color: COLORS.error }]}>-₹{Math.abs(currentPayout.commission).toLocaleString()}</Text>
        </View>
        <View style={styles.financialRow}>
          <Text style={styles.finLabel}>GST on Commission</Text>
          <Text style={[styles.finValue, { color: COLORS.error }]}>-₹{Math.abs(currentPayout.gst).toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.netRow}>
          <View>
            <Text style={styles.netLabel}>Net Payout</Text>
            <Text style={styles.netValue}>₹{currentPayout.net.toLocaleString()}</Text>
          </View>
          {currentPayout.status === 'PENDING' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Processing</Text>
            </View>
          )}
        </View>

        <View style={styles.dateInfoBox}>
          <MaterialIcons name="info-outline" size={16} color="#64748B" />
          <Text style={styles.dateInfoText}>Expected by {currentPayout.expectedDate}</Text>
        </View>
      </View>

      {/* Upgrade Banner */}
      <TouchableOpacity style={styles.upgradeBanner}>
        <View style={styles.upgradeContent}>
          <MaterialIcons name="star" size={24} color="#F59E0B" />
          <View style={styles.upgradeTextContainer}>
            <Text style={styles.upgradeTitle}>Upgrade to Premium (5%)</Text>
            <Text style={styles.upgradeDesc}>
              If you were on Premium, this payout would be ₹3,100 higher.
            </Text>
          </View>
        </View>
        <MaterialIcons name="arrow-forward" size={20} color="#F59E0B" />
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Payout History</Text>
    </View>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return { color: '#10B981', bg: '#D1FAE5' };
      case 'FAILED': return { color: '#EF4444', bg: '#FEE2E2' };
      default: return { color: '#F59E0B', bg: '#FEF3C7' };
    }
  };

  return (
    <Layout title="Settlements & Payouts" activeBottomTabKey="settlements">
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <TouchableOpacity style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyRef}>{item.ref}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.historyBottom}>
                <Text style={styles.historyAmount}>₹{item.amount.toLocaleString()}</Text>
                <TouchableOpacity style={styles.statementButton}>
                  <MaterialIcons name="receipt" size={14} color={COLORS.primary} />
                  <Text style={styles.statementText}>Statement</Text>
                </TouchableOpacity>
              </View>
              {item.status === 'FAILED' && (
                <Text style={styles.failedReason}>{item.reason}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  tierHeader: {
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  tierText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.error,
    fontWeight: FONT_WEIGHT.medium,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 20,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  finLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  finValue: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  netLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  netValue: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    color: '#D97706',
  },
  dateInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  dateInfoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: FONT_WEIGHT.medium,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 32,
  },
  upgradeContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 15,
    fontWeight: FONT_WEIGHT.bold,
    color: '#92400E',
  },
  upgradeDesc: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 4,
    lineHeight: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  historyRef: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  historyBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF5ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  statementText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  failedReason: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default SettlementsScreen;

