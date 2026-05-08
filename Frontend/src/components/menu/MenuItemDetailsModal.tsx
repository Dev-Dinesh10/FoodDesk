import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT, TYPOGRAPHY } from '../../constants/typography';

interface MenuItemDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  onEdit: () => void;
}

const MenuItemDetailsModal: React.FC<MenuItemDetailsModalProps> = ({
  visible,
  onClose,
  item,
  onEdit
}) => {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Food Item Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Image */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={item.image} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialIcons name="fastfood" size={48} color={COLORS.textDisabled} />
                </View>
              )}
              {/* Veg/Non-Veg Dot */}
              <View style={[styles.vegIndicatorBox, { borderColor: item.isVegetarian ? '#22C55E' : '#EF4444' }]}>
                <View style={[styles.vegIndicatorDot, { backgroundColor: item.isVegetarian ? '#22C55E' : '#EF4444' }]} />
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.titleRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <MaterialIcons name="category" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>{item.category}</Text>
                </View>
                <View style={styles.metaBadge}>
                  <MaterialIcons name="schedule" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>15-20 mins</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.description}>
                Delicious {item.name} prepared with fresh ingredients. Perfect for a fulfilling meal.
              </Text>

              <View style={styles.divider} />

              {/* Nutrition */}
              <Text style={styles.sectionLabel}>Nutrition</Text>
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionItem}><Text style={styles.nutValue}>{item.calories || '450'}</Text><Text style={styles.nutLabel}>kcal</Text></View>
                <View style={styles.nutritionItem}><Text style={styles.nutValue}>{item.protein || '12g'}</Text><Text style={styles.nutLabel}>Protein</Text></View>
                <View style={styles.nutritionItem}><Text style={styles.nutValue}>{item.carbs || '55g'}</Text><Text style={styles.nutLabel}>Carbs</Text></View>
                <View style={styles.nutritionItem}><Text style={styles.nutValue}>{item.fat || '10g'}</Text><Text style={styles.nutLabel}>Fat</Text></View>
              </View>

              <View style={styles.divider} />

              {/* Smart Tags */}
              <Text style={styles.sectionLabel}>Tags</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}><Text style={styles.tagText}>⭐ Best Seller</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>🔥 Trending</Text></View>
              </View>

              <View style={styles.divider} />

              {/* Additional Details */}
              <Text style={styles.sectionLabel}>Additional Details</Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Offer Price</Text>
                  <Text style={styles.detailValue}>₹{item.offerPrice || (item.price - 30)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Packing Cost</Text>
                  <Text style={styles.detailValue}>₹{item.packingCost || '10'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Customization</Text>
                  <Text style={styles.detailValue}>{item.isCustomizable ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Course</Text>
                  <Text style={styles.detailValue}>{item.course || 'Main Course'}</Text>
                </View>
              </View>

            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.editButton} onPress={() => { onEdit(); onClose(); }}>
              <MaterialIcons name="edit" size={16} color={COLORS.white} />
              <Text style={styles.editButtonText}>Edit Item</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
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
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: SPACING.md,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegIndicatorBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 16,
    height: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  vegIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoSection: {
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  nutritionItem: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    marginHorizontal: 2,
  },
  nutValue: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  nutLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#FFF5ED',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tagText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  editButton: {
    width: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});

export default MenuItemDetailsModal;
