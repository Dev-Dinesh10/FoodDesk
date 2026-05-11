import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import { DayData, DayStatus, STATUS_CONFIG } from './types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarViewProps {
  grid: (DayData | null)[][];
  onDayPress: (d: DayData) => void;
  selectedFilter?: string;
}

const DayCell = ({
  item,
  onPress,
  selectedFilter,
}: {
  item: DayData | null;
  onPress?: (d: DayData) => void;
  selectedFilter?: string;
}) => {
  if (!item) {
    return <View style={[styles.cell, { backgroundColor: 'transparent' }]} />;
  }
  const cfg = STATUS_CONFIG[item.status];
  const isDimmed = selectedFilter && selectedFilter !== 'All statuses' && item.status.toLowerCase() !== selectedFilter.toLowerCase();
  
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.cell,
        { backgroundColor: cfg.bg },
        pressed && { opacity: 0.75 },
        isDimmed && { opacity: 0.15 },
      ]}
    >
      <View style={styles.cellTop}>
        <Text style={[styles.dayNum, { color: cfg.textColor }]}>
          {item.day}
        </Text>
        {item.status !== 'none' && (
          <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
        )}
      </View>
      {item.status !== 'none' && item.status !== 'inactive' && (
        <Text style={[styles.statusLabel, { color: cfg.textColor }]}>
          {cfg.label.toUpperCase()}
        </Text>
      )}
      {item.hours !== undefined && (
        <Text style={styles.hours}>{item.hours}h</Text>
      )}
    </Pressable>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ grid, onDayPress, selectedFilter }) => {
  return (
    <View style={styles.wrapper}>
      {/* Day-of-week header */}
      <View style={styles.header}>
        {DAY_NAMES.map((d) => (
          <Text key={d} style={styles.headerText}>
            {d}
          </Text>
        ))}
      </View>
      {/* Rows */}
      {grid.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((item, ci) => (
            <DayCell key={ci} item={item} onPress={onDayPress} selectedFilter={selectedFilter} />
          ))}
        </View>
      ))}
      {/* Legend */}
      <View style={styles.legend}>
        {(['active', 'inactive', 'leave', 'holiday'] as DayStatus[]).map((s) => (
          <View key={s} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_CONFIG[s].dot }]} />
            <Text style={styles.legendText}>{STATUS_CONFIG[s].label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    paddingVertical: 4,
    marginHorizontal: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderRadius: 6,
    padding: 4,
    margin: 1,
    height: 50,
    justifyContent: 'space-between',
  },
  emptyCell: {
    flex: 1,
    margin: 1,
    height: 50,
  },
  cellTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayNum: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusLabel: {
    fontSize: 7,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.2,
  },
  hours: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
});
