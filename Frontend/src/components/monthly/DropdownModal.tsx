import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

interface DropdownModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (option: string) => void;
  selectedValue: string;
  title?: string;
}

export const DropdownModal: React.FC<DropdownModalProps> = ({
  visible,
  onClose,
  options,
  onSelect,
  selectedValue,
  title,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {title && <Text style={styles.title}>{title}</Text>}
          <ScrollView>
            {options.map((option) => {
              const isSelected = option === selectedValue;
              return (
                <Pressable
                  key={option}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check" size={18} color={COLORS.primary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.sm,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  optionItemSelected: {
    backgroundColor: '#FFF7ED',
  },
  optionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
});
