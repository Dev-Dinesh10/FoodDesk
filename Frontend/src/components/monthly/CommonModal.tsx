import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import { DayData, DayStatus, STATUS_CONFIG } from './types';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  data: DayData | null;
  onSave: (updatedData: DayData) => void;
}

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  onClose,
  data,
  onSave,
}) => {
  const [status, setStatus] = useState<DayStatus>('none');
  const [hours, setHours] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setHours(data.hours !== undefined ? String(data.hours) : '');
      setSelectedMeals(data.mealWindows || []);
      setNotes(data.notes || '');
    }
  }, [data, visible]);

  const toggleMeal = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const handleSave = () => {
    if (!data) return;
    onSave({
      ...data,
      status,
      hours: hours ? Number(hours) : undefined,
      mealWindows: selectedMeals.length > 0 ? selectedMeals : undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  if (!data) return null;

  const statusOptions: DayStatus[] = ['active', 'inactive', 'leave', 'holiday'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ width: '100%' }}
        >
          <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{data.dateStr || `Day ${data.day}`}</Text>
              <Text style={styles.subtitle}>Update activity status, service hours and notes.</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Status</Text>
            <View style={styles.pillsRow}>
              {statusOptions.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const isActive = status === s;
                return (
                  <Pressable
                    key={s}
                    style={[
                      styles.pill,
                      isActive && { backgroundColor: cfg.bg, borderColor: cfg.dot },
                    ]}
                    onPress={() => setStatus(s)}
                  >
                    {isActive && (
                      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
                    )}
                    <Text
                      style={[
                        styles.pillText,
                        { color: isActive ? cfg.textColor : COLORS.textPrimary },
                      ]}
                    >
                      {cfg.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Service Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Service hours</Text>
            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
              placeholder="e.g., 9"
            />
          </View>

          {/* Meal Windows */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Meal windows</Text>
            <View style={styles.pillsRow}>
              {MEAL_OPTIONS.map((meal) => {
                const isSelected = selectedMeals.includes(meal);
                return (
                  <Pressable
                    key={meal}
                    style={[
                      styles.mealPill,
                      isSelected && styles.mealPillSelected,
                    ]}
                    onPress={() => toggleMeal(meal)}
                  >
                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={16} color={COLORS.white} />
                    ) : (
                      <MaterialIcons name="add" size={16} color={COLORS.textSecondary} />
                    )}
                    <Text
                      style={[
                        styles.mealPillText,
                        isSelected && styles.mealPillTextSelected,
                      ]}
                    >
                      {meal}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes / remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholder="Optional remarks for this day"
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save changes</Text>
            </Pressable>
          </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.semibold,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 80,
  },
  mealPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  mealPillSelected: {
    backgroundColor: COLORS.primary,
  },
  mealPillText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  mealPillTextSelected: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
});
