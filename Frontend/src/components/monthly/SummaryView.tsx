import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import { DayData, DayStatus, STATUS_CONFIG } from './types';

interface SummaryViewProps {
  days: DayData[];
}

export const SummaryView: React.FC<SummaryViewProps> = ({ days }) => {
  const counts = useMemo(() => {
    const acc: Record<DayStatus, number> = {
      active: 0, holiday: 0, leave: 0, inactive: 0, none: 0,
    };
    days.forEach((d) => acc[d.status]++);
    return acc;
  }, [days]);

  const totalHours = days
    .filter((d) => d.status === 'active')
    .reduce((s, d) => s + (d.hours ?? 0), 0);

  const rows: { status: DayStatus; count: number }[] = [
    { status: 'active', count: counts.active },
    { status: 'leave', count: counts.leave },
    { status: 'holiday', count: counts.holiday },
    { status: 'inactive', count: counts.inactive },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Utilization bar */}
      <View style={styles.utilizationCard}>
        <View style={styles.utilizationHeader}>
          <Text style={styles.utilizationTitle}>Utilization Rate</Text>
          <Text style={styles.utilizationPct}>
            {days.length > 0
              ? Math.round((counts.active / days.length) * 100)
              : 0}
            %
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${
                  days.length > 0
                    ? Math.round((counts.active / days.length) * 100)
                    : 0
                }%`,
              },
            ]}
          />
        </View>
        <Text style={styles.utilizationSub}>
          {totalHours} service hours this month
        </Text>
      </View>

      {/* Breakdown rows */}
      {rows.map(({ status, count }) => {
        const cfg = STATUS_CONFIG[status];
        const pct = days.length > 0 ? Math.round((count / days.length) * 100) : 0;
        return (
          <View key={status} style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: cfg.dot }]} />
            <Text style={styles.breakdownLabel}>{cfg.label}</Text>
            <View style={styles.breakdownBarWrap}>
              <View style={styles.breakdownBarTrack}>
                <View
                  style={[
                    styles.breakdownBarFill,
                    { width: `${pct}%`, backgroundColor: cfg.dot },
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.breakdownCount, { color: cfg.textColor }]}>
              {count} days
            </Text>
          </View>
        );
      })}

      {/* Monthly Remarks */}
      <View style={styles.remarksCard}>
        <Text style={styles.remarksTitle}>Monthly remarks</Text>
        <Text style={styles.remarksSubtitle}>Add overall notes for the Aggregator Admin reviewing this month.</Text>
        <TextInput
          style={styles.remarksInput}
          placeholder="e.g., Counter closed on May 12 due to municipal water cut. Festival menu offered Mon/Wed."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={COLORS.textSecondary}
        />
        <View style={styles.remarksFooter}>
          <Pressable style={styles.saveRemarksBtn}>
            <Text style={styles.saveRemarksText}>Save remarks</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: SPACING.md },
  remarksCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  remarksTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  remarksSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 13,
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
    height: 80,
  },
  remarksFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveRemarksBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveRemarksText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  utilizationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  utilizationTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  utilizationPct: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.success,
  },
  barTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 6,
  },
  utilizationSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  breakdownRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  breakdownDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: {
    width: 60,
    fontSize: 13,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  breakdownBarWrap: { flex: 1 },
  breakdownBarTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownBarFill: { height: '100%', borderRadius: 4 },
  breakdownCount: {
    width: 52,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'right',
  },
});
