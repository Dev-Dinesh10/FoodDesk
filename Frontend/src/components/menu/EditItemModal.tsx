import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  Switch,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

interface EditItemModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  onSave: (updatedItem: any) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ visible, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    isVegetarian: true,
    isAvailable: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        isVegetarian: item.isVegetarian || true,
        isAvailable: item.isAvailable,
      });
    }
  }, [item]);

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit item</Text>
              <Text style={styles.subtitle}>Update the details below.</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Photo Section */}
            <Text style={styles.label}>Photo</Text>
            <View style={styles.photoRow}>
              <Image source={item.image} style={styles.photo} />
              <TouchableOpacity style={styles.uploadBtn}>
                <MaterialIcons name="upload" size={20} color={COLORS.textPrimary} />
                <Text style={styles.uploadText}>Upload photo</Text>
              </TouchableOpacity>
            </View>

            {/* Basic Info */}
            <Text style={styles.label}>Item name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g. Masala Chai"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.label}>Category</Text>
                <View style={[styles.input, styles.dropdown]}>
                  <Text>{formData.category}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.textSecondary} />
                </View>
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.row}>
              <View style={styles.toggleCard}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Vegetarian</Text>
                  <Text style={styles.toggleDesc}>Shown with veg/non-veg mark</Text>
                </View>
                <Switch
                  value={formData.isVegetarian}
                  onValueChange={(val) => setFormData({ ...formData, isVegetarian: val })}
                  trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                  style={styles.smallSwitch}
                />
              </View>
              <View style={[styles.toggleCard, { marginLeft: SPACING.md }]}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Available today</Text>
                  <Text style={styles.toggleDesc}>Visible to employees</Text>
                </View>
                <Switch
                  value={formData.isAvailable}
                  onValueChange={(val) => setFormData({ ...formData, isAvailable: val })}
                  trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                  style={styles.smallSwitch}
                />
              </View>
            </View>

            {/* Optional Details Collapsible */}
            <TouchableOpacity style={styles.collapsible}>
              <Text style={styles.collapsibleText}>Optional details — description, allergens, nutrition</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={() => onSave({ ...item, ...formData, price: parseFloat(formData.price) })}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
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
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: SPACING.md,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 12,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: '#FAFAFA',
  },
  row: {
    flexDirection: 'row',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.lg,
    backgroundColor: '#FAFAFA',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 8,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  toggleDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  smallSwitch: {
    // Normal size, not scaled
  },
  collapsible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  collapsibleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});

export default EditItemModal;
