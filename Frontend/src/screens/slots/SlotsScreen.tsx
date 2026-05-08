import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import AddSlotModal from '../../components/slots/AddSlotModal';

interface SlotWindow {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  slotLength: number;
  capacity: number;
  active: boolean;
  slots: string[];
}

const INITIAL_WINDOWS: SlotWindow[] = [
  {
    id: '1',
    name: 'Lunch',
    startTime: '12:00',
    endTime: '15:00',
    slotLength: 15,
    capacity: 25,
    active: true,
    slots: ['12:00-12:15', '12:15-12:30', '12:30-12:45', '12:45-13:00', '13:00-13:15', '13:15-13:30', '13:30-13:45', '13:45-14:00', '14:00-14:15', '14:15-14:30', '14:30-14:45', '14:45-15:00'],
  },
  {
    id: '2',
    name: 'Evening Snack',
    startTime: '16:30',
    endTime: '18:00',
    slotLength: 15,
    capacity: 15,
    active: true,
    slots: ['16:30-16:45', '16:45-17:00', '17:00-17:15', '17:15-17:30', '17:30-17:45', '17:45-18:00'],
  },
];

const SlotsScreen = () => {
  const [windows, setWindows] = useState<SlotWindow[]>(INITIAL_WINDOWS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState<SlotWindow | null>(null);

  const toggleActive = (id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, active: !w.active } : w)
    );
  };

  const handleSaveWindow = (savedWindow: SlotWindow) => {
    if (isEditMode) {
      setWindows(prev =>
        prev.map(w => w.id === savedWindow.id ? savedWindow : w)
      );
    } else {
      setWindows(prev => [...prev, savedWindow]);
    }
  };

  const handleEdit = (window: SlotWindow) => {
    setSelectedWindow(window);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDeleteWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Slot Management</Text>
            <Text style={styles.subtitle}>Define meal windows and pickup slots</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => {
              setIsEditMode(false);
              setSelectedWindow(null);
              setIsModalVisible(true);
            }}
          >
            <MaterialIcons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addBtnText}>New Window</Text>
          </TouchableOpacity>
        </View>

        {windows.map(window => (
          <View key={window.id} style={[styles.card, !window.active && styles.inactiveCard]}>
            <View style={styles.cardHeader}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.windowName}>{window.name}</Text>
                  {!window.active && (
                    <View style={styles.pausedBadge}>
                      <Text style={styles.pausedText}>Paused</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.windowMeta}>
                  {window.startTime} - {window.endTime} · {window.slotLength} min slots
                </Text>
                <Text style={styles.windowMeta}>
                  {window.capacity}/slot · {window.slots.length} pickup slots
                </Text>
              </View>
              <View style={styles.actions}>
                <Switch
                  value={window.active}
                  onValueChange={() => toggleActive(window.id)}
                  trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                  thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
                  style={{ transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }] }}
                />
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(window)}>
                  <MaterialIcons name="edit" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDeleteWindow(window.id)}>
                  <MaterialIcons name="delete" size={16} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsScroll}>
              {window.slots.map((slot, index) => (
                <View key={index} style={styles.slotChip}>
                  <Text style={styles.slotText}>{slot}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      <AddSlotModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          setSelectedWindow(null);
        }}
        onSave={handleSaveWindow}
        isEdit={isEditMode}
        initialData={selectedWindow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  pausedBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FEE2E2',
  },
  pausedText: {
    fontSize: 10,
    color: COLORS.error,
    fontWeight: FONT_WEIGHT.bold,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  windowName: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  windowMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  slotsScroll: {
    gap: 6,
    paddingVertical: 4,
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
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default SlotsScreen;
