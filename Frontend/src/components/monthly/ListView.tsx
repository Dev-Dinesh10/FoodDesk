import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import { DayData, STATUS_CONFIG } from './types';

interface ListViewProps {
  days: DayData[];
  onEdit?: (day: DayData) => void;
}

export const ListView: React.FC<ListViewProps> = ({ days, onEdit }) => (
  <View style={styles.container}>
    {days.map((d) => {
      const cfg = STATUS_CONFIG[d.status];
      return (
        <View key={d.day} style={styles.cardItem}>
          {/* Top Row: Date, Badge, Edit Action */}
          <View style={styles.cardHeader}>
            <View style={styles.dateWrap}>
              <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
              <Text style={styles.dateText}>{d.dateStr || `Day ${d.day}`}</Text>
            </View>
            
            <View style={styles.rightHeader}>
              <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.badgeText, { color: cfg.textColor }]}>
                  {cfg.label}
                </Text>
              </View>
              <Pressable style={styles.editBtn} onPress={() => onEdit?.(d)} hitSlop={8}>
                <MaterialIcons name="edit" size={16} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hours</Text>
              <Text style={styles.detailValue}>{d.hours !== undefined ? `${d.hours}h` : '-'}</Text>
            </View>
            
            <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.detailLabel}>Meal Windows</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {d.mealWindows?.join(', ') || '-'}
              </Text>
            </View>
          </View>
          
          {d.notes && (
            <View style={styles.notesRow}>
              <Text style={styles.detailLabel}>Notes: </Text>
              <Text style={styles.notesText}>{d.notes}</Text>
            </View>
          )}
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  cardItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  editBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  detailItem: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  notesRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    backgroundColor: '#F8FAFC',
    padding: SPACING.sm,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.regular,
    flex: 1,
  },
});
