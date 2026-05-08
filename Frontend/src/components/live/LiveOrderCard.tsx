import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

export type OrderStatus = 'INCOMING' | 'PREPARING' | 'READY';

interface LiveOrderCardProps {
  token: string;
  employeeName?: string;
  items: string[];
  slotTime: string;
  status: OrderStatus;
  slaProgress: number; // 0 to 1
  onStartPrep?: () => void;
  onMarkReady?: () => void;
}

const STATUS_COLORS = {
  INCOMING: '#0077B6', // Deep Blue
  PREPARING: '#F59E0B', // Amber/Orange
  READY: '#10B981', // Green
};

const LiveOrderCard: React.FC<LiveOrderCardProps> = ({
  token,
  employeeName,
  items,
  slotTime,
  status,
  slaProgress,
  onStartPrep,
  onMarkReady,
}) => {
  const getSlaColor = () => {
    if (status === 'INCOMING') return COLORS.primary;
    if (status === 'PREPARING') return COLORS.warning;
    if (status === 'READY') return COLORS.success;
    return COLORS.primary;
  };

  const isBreached = slaProgress >= 1.0;

  return (
    <View style={[
      styles.card,
      isBreached && styles.breachedCard
    ]}>
      <View style={styles.header}>
        <Text style={styles.tokenText}>{token}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[status] }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {employeeName && (
          <Text style={styles.employeeText}>For: {employeeName}</Text>
        )}
        <Text style={styles.itemsText} numberOfLines={2}>
          {items.join(', ')}
        </Text>
        <View style={styles.metaRow}>
          <MaterialIcons name="schedule" size={14} color={COLORS.textSecondary} />
          <Text style={styles.slotText}>{slotTime}</Text>
        </View>
      </View>

      {/* SLA Progress Bar */}
      <View style={styles.slaContainer}>
        <Text style={[styles.slaLabel, { color: getSlaColor() }]}>
          {isBreached ? 'SLA BREACHED' : `${Math.round(slaProgress * 100)} min`}
        </Text>
        <View style={styles.slaBackground}>
          <View style={[
            styles.slaFill,
            { width: `${Math.min(slaProgress * 100, 100)}%`, backgroundColor: getSlaColor() }
          ]} />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {status === 'INCOMING' && (
          <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onStartPrep}>
            <Text style={styles.acceptBtnText}>Start Preparation</Text>
          </TouchableOpacity>
        )}
        {status === 'PREPARING' && (
          <TouchableOpacity style={[styles.actionBtn, styles.readyBtn]} onPress={onMarkReady}>
            <Text style={styles.readyBtnText}>Mark Ready</Text>
          </TouchableOpacity>
        )}
        {status === 'READY' && (
          <View style={styles.readyIndicator}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.success} />
            <Text style={styles.readyIndicatorText}>Waiting for Pickup</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    minHeight: 100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  breachedCard: {
    borderColor: COLORS.error,
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tokenText: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  content: {
    marginBottom: SPACING.sm,
  },
  employeeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemsText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  slaContainer: {
    marginBottom: SPACING.md,
  },
  slaBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  slaFill: {
    height: '100%',
  },
  slaLabel: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'right',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  acceptBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: 12,
  },
  readyBtn: {
    backgroundColor: COLORS.success,
    width: '100%',
  },
  readyBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: 12,
  },
  readyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readyIndicatorText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.success,
  },
});

export default LiveOrderCard;
