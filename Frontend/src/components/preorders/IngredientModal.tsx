import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

interface Ingredient {
  name: string;
  qty: string;
}

interface ItemIngredients {
  itemName: string;
  portions: number;
  ingredients: Ingredient[];
}

interface IngredientModalProps {
  visible: boolean;
  onClose: () => void;
  data: ItemIngredients[];
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, data }) => {
  const [safetyBuffer, setSafetyBuffer] = useState(true);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Ingredient list — May 6</Text>
              <Text style={styles.subtitle}>Calculated from confirmed pre-orders.</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Buffer Toggle */}
          <View style={styles.bufferRow}>
            <Text style={styles.bufferText}>Add 10% safety buffer</Text>
            <Switch
              value={safetyBuffer}
              onValueChange={setSafetyBuffer}
              trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
            />
          </View>

          {/* List */}
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {data.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <View style={styles.portionBadge}>
                    <Text style={styles.portionText}>{item.portions} portions</Text>
                  </View>
                </View>
                <View style={styles.ingredientsGrid}>
                  {item.ingredients.map((ing, idx) => (
                    <Text key={idx} style={styles.ingredientText}>
                      • {ing.name} {ing.qty}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton}>
              <MaterialIcons name="description" size={18} color={COLORS.white} />
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.md,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeIcon: {
    padding: 4,
  },
  bufferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  bufferText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  listContainer: {
    marginBottom: SPACING.md,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  portionBadge: {
    backgroundColor: '#F7F2E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  portionText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: FONT_WEIGHT.medium,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientText: {
    width: '50%',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: SPACING.sm,
  },
  closeButton: {
    width: 120,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  downloadButton: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});

export default IngredientModal;
