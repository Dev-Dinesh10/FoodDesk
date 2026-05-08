import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT, TYPOGRAPHY } from '../../constants/typography';

interface InventoryData {
  dailyLimit: string;
  lowStockAlert: string;
  autoDisable: boolean;
}

interface InventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: InventoryData) => void;
  initialData?: InventoryData;
  itemName: string;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
  itemName
}) => {
  const [data, setData] = useState<InventoryData>({
    dailyLimit: '100',
    lowStockAlert: '10',
    autoDisable: true
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheet}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconBox}>
                  <MaterialIcons name="inventory" size={18} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.title}>Inventory Settings</Text>
                  <Text style={styles.subtitle}>{itemName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <MaterialIcons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Daily Limit */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Daily Limit</Text>
                <TextInput
                  style={styles.input}
                  value={data.dailyLimit}
                  onChangeText={t => setData(p => ({ ...p, dailyLimit: t }))}
                  keyboardType="numeric"
                  placeholder="e.g. 100"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Low Stock Alert */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Low Stock Alert</Text>
                <TextInput
                  style={styles.input}
                  value={data.lowStockAlert}
                  onChangeText={t => setData(p => ({ ...p, lowStockAlert: t }))}
                  keyboardType="numeric"
                  placeholder="e.g. 10"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Auto Disable */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Auto Disable on Sold Out</Text>
                  <Text style={styles.toggleSub}>Turns off automatically when stock hits 0</Text>
                </View>
                <Switch
                  value={data.autoDisable}
                  onValueChange={val => setData(p => ({ ...p, autoDisable: val }))}
                  trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                  thumbColor="#fff"
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollContent: {
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  cancelBtn: {
    width: 120,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  saveBtn: {
    width: 120,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});

export default InventoryModal;
