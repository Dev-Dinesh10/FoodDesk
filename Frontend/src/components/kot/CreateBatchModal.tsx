import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import { DropdownModal } from '../monthly/DropdownModal';

interface CreateBatchModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: { station: string; mins: string; priority: string; items: string }) => void;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({ visible, onClose, onCreate }) => {
  const [station, setStation] = useState('Hot Counter');
  const [mins, setMins] = useState('20');
  const [priority, setPriority] = useState('Normal');
  const [items, setItems] = useState('Veg Burger × 3\nCold Coffee × 2');
  
  const [stationVisible, setStationVisible] = useState(false);
  const [priorityVisible, setPriorityVisible] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>Create new KOT batch</Text>
              <Text style={styles.subtitle}>Group orders into a single batch for the kitchen station.</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Kitchen station</Text>
                <Pressable style={styles.dropdownBox} onPress={() => setStationVisible(true)}>
                  <Text style={styles.dropdownText}>{station}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textSecondary} />
                </Pressable>
              </View>
              <View style={[styles.inputGroup, { width: 100 }]}>
                <Text style={styles.label}>Estimated mins</Text>
                <TextInput 
                  style={styles.textInput} 
                  value={mins} 
                  onChangeText={setMins} 
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <Pressable style={styles.dropdownBox} onPress={() => setPriorityVisible(true)}>
                <Text style={styles.dropdownText}>{priority}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Items (one per line, e.g. "Veg Burger × 3")</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={items}
                onChangeText={setItems}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.createBtn} onPress={() => onCreate({ station, mins, priority, items })}>
              <Text style={styles.createBtnText}>Create batch</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>

      {/* Nested Modals */}
      <DropdownModal
        visible={stationVisible}
        onClose={() => setStationVisible(false)}
        options={['Hot Counter', 'Tandoor', 'Cold Counter', 'Beverage']}
        onSelect={setStation}
        selectedValue={station}
        title="Select Station"
      />

      <DropdownModal
        visible={priorityVisible}
        onClose={() => setPriorityVisible(false)}
        options={['Normal', 'High', 'Low']}
        onSelect={setPriority}
        selectedValue={priority}
        title="Select Priority"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    gap: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 40,
    backgroundColor: '#F8FAFC',
  },
  dropdownText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 40,
    backgroundColor: '#F8FAFC',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  multilineInput: {
    height: 100,
    paddingVertical: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
});
