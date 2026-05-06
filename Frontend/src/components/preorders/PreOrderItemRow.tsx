import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

interface PreOrderItemRowProps {
  name: string;
  totalQty: number;
  slots: number[]; // Array for easier mapping
  gmv: string;
  isUnavailable?: boolean;
  onFlagUnavailable: () => void;
}

const PreOrderItemRow: React.FC<PreOrderItemRowProps> = ({
  name,
  totalQty,
  slots,
  gmv,
  isUnavailable,
  onFlagUnavailable,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.row, isUnavailable && styles.unavailableRow]}
      onLongPress={() => {
        Alert.alert(
          'Flag as Unavailable?',
          `Flag "${name}" as unavailable?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Flag', style: 'destructive', onPress: onFlagUnavailable }
          ]
        );
      }}
    >
      <View style={styles.nameCol}>
        <Text style={[styles.nameText, isUnavailable && styles.unavailableText]}>{name}</Text>
      </View>
      <View style={styles.qtyCol}>
        <Text style={[styles.qtyText, isUnavailable && styles.unavailableText]}>{totalQty}</Text>
      </View>
      {slots.map((val, idx) => (
        <View key={idx} style={styles.slotCol}>
          <Text style={[
            styles.slotText, 
            idx === 0 && !isUnavailable && styles.highlightSlot,
            isUnavailable && styles.unavailableText
          ]}>
            {val}
          </Text>
        </View>
      ))}
      <View style={styles.gmvCol}>
        <Text style={[styles.gmvText, isUnavailable && styles.unavailableText]}>₹{gmv}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  unavailableRow: {
    backgroundColor: '#FFF1F1',
  },
  nameCol: { flex: 2.5 },
  qtyCol: { flex: 1, alignItems: 'flex-start' },
  slotCol: { flex: 0.8, alignItems: 'center' },
  gmvCol: { flex: 1.5, alignItems: 'flex-end' },
  nameText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  qtyText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  slotText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  highlightSlot: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  gmvText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  unavailableText: {
    color: COLORS.error,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});

export default PreOrderItemRow;
