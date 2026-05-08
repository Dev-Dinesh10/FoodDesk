import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

interface AddSlotModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (window: any) => void;
  isEdit?: boolean;
  initialData?: any;
}

const PRESET_NAMES = ['Breakfast', 'Lunch', 'Evening Snack', 'Dinner'];

const AddSlotModal: React.FC<AddSlotModalProps> = ({ visible, onClose, onSave, isEdit, initialData }) => {
  const [name, setName] = useState('Lunch');
  const [fromTime, setFromTime] = useState('12:00');
  const [toTime, setToTime] = useState('15:00');
  const [slotLength, setSlotLength] = useState('15');
  const [capacity, setCapacity] = useState('20');
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name);
      setFromTime(initialData.startTime);
      setToTime(initialData.endTime);
      setSlotLength(initialData.slotLength.toString());
      setCapacity(initialData.capacity.toString());
    } else {
      // Reset to defaults for new window
      setName('Lunch');
      setFromTime('12:00');
      setToTime('15:00');
      setSlotLength('15');
      setCapacity('20');
    }
  }, [isEdit, initialData, visible]);

  useEffect(() => {
    generateSlots();
  }, [fromTime, toTime, slotLength]);

  const generateSlots = () => {
    const parseTime = (str: string) => {
      const [hours, minutes] = str.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    try {
      const from = parseTime(fromTime);
      const to = parseTime(toTime);
      const length = Number(slotLength);

      if (isNaN(from) || isNaN(to) || isNaN(length) || from >= to || length <= 0) {
        setSlots([]);
        return;
      }

      const generated = [];
      for (let cur = from; cur + length <= to; cur += length) {
        generated.push(`${formatTime(cur)}-${formatTime(cur + length)}`);
      }
      setSlots(generated);
    } catch (e) {
      setSlots([]);
    }
  };

  const handleTimeChange = (text: string, setter: (val: string) => void) => {
    let cleaned = text.replace(/[^0-9:]/g, '');
    
    // Auto insert colon
    if (cleaned.length === 2 && !cleaned.includes(':') && text.length > fromTime.length) {
      cleaned = cleaned + ':';
    }
    
    if (cleaned.length <= 5) {
      setter(cleaned);
    }
  };

  const handleSave = () => {
    onSave({
      id: isEdit && initialData ? initialData.id : Math.random().toString(),
      name,
      startTime: fromTime,
      endTime: toTime,
      slotLength: Number(slotLength),
      capacity: Number(capacity),
      active: isEdit && initialData ? initialData.active : true,
      slots,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{isEdit ? 'Edit meal window' : 'New meal window'}</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Window name</Text>
              <View style={styles.chipsRow}>
                {PRESET_NAMES.map(preset => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.chip, name === preset && styles.activeChip]}
                    onPress={() => setName(preset)}
                  >
                    <Text style={[styles.chipText, name === preset && styles.activeChipText]}>
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Custom name"
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>From (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={fromTime}
                    onChangeText={(t) => handleTimeChange(t, setFromTime)}
                    placeholder="12:00"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.rowGap} />
                <View style={styles.flex1}>
                  <Text style={styles.label}>To (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={toTime}
                    onChangeText={(t) => handleTimeChange(t, setToTime)}
                    placeholder="15:00"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Slot length (min)</Text>
                  <TextInput
                    style={styles.input}
                    value={slotLength}
                    onChangeText={setSlotLength}
                    placeholder="15"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.rowGap} />
                <View style={styles.flex1}>
                  <Text style={styles.label}>Capacity per slot</Text>
                  <TextInput
                    style={styles.input}
                    value={capacity}
                    onChangeText={setCapacity}
                    placeholder="20"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>
                  PREVIEW · {slots.length} PICKUP SLOTS
                </Text>
                <View style={styles.slotsGrid}>
                  {slots.map((slot, index) => (
                    <View key={index} style={styles.slotChip}>
                      <Text style={styles.slotText}>{slot}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>{isEdit ? 'Save' : 'Save window'}</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  form: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  activeChipText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  rowGap: {
    width: SPACING.md,
  },
  previewSection: {
    marginTop: SPACING.md,
    backgroundColor: '#F8FAFC',
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  slotChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  footer: {
    marginTop: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: 14,
  },
});

export default AddSlotModal;
