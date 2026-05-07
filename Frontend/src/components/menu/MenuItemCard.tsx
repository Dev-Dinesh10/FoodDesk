import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

interface MenuItemCardProps {
  name: string;
  price: number;
  image?: any;
  isAvailable: boolean;
  isSoldOut: boolean;
  orderedToday: number;
  isVegetarian: boolean;
  onToggleAvailability: () => void;
  onMarkSoldOut: () => void;
  onEdit: () => void;
}

const TOTAL_STOCK = 200;

const getAvailabilityColor = (qty: number) => {
  if (qty >= 150) return '#22C55E'; // Green
  if (qty >= 100) return '#F59E0B'; // Amber
  if (qty >= 50) return '#EAB308';  // Yellow
  return '#EF4444';                 // Red
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  price,
  image,
  isAvailable,
  isSoldOut,
  orderedToday,
  isVegetarian,
  onToggleAvailability,
  onMarkSoldOut,
  onEdit,
}) => {
  const remainingQty = Math.max(TOTAL_STOCK - orderedToday, 0);

  return (
    <View style={[styles.card, !isAvailable && styles.greyedOut]}>

      {/* ── Top-right: Toggle + Veg/Non-Veg dot (absolutely positioned) ── */}
      <View style={styles.topRightActions}>
        <Switch
          value={isAvailable}
          onValueChange={onToggleAvailability}
          trackColor={{ false: '#CBD5E1', true: '#10B981' }}
          thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
          style={{ transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }] }}
        />
        <View style={[styles.vegIndicatorBox, { borderColor: isVegetarian ? '#22C55E' : '#EF4444' }]}>
          <View style={[styles.vegIndicatorDot, { backgroundColor: isVegetarian ? '#22C55E' : '#EF4444' }]} />
        </View>
      </View>

      {/* ── Left Column: Image + actions ── */}
      <View style={styles.leftColumn}>
        <View style={styles.thumbnailContainer}>
          {image ? (
            <Image source={image} style={styles.thumbnail} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="add-a-photo" size={24} color={COLORS.textDisabled} />
              <Text style={styles.placeholderText}>Add photo</Text>
            </View>
          )}
          {isSoldOut && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          )}
        </View>

        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.editBtnInline} onPress={onEdit}>
            <MaterialIcons name="edit" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {!isSoldOut && (
            <TouchableOpacity style={styles.soldOutBtnInline} onPress={onMarkSoldOut}>
              <Text style={styles.soldOutBtnText}>Sold Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Info Area ── */}
      <View style={styles.infoContainer}>
        {/* Name + Price — padded right so they don't overlap the toggle */}
        <View style={styles.headerRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.price}>₹{price}</Text>
          </View>
        </View>

        {/* Availability Bar */}
        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityHeader}>
            <View>
              <Text style={styles.availabilityLabel}>Remaining</Text>
              <Text style={[styles.availabilityValue, { color: getAvailabilityColor(remainingQty) }]}>
                {remainingQty} left
              </Text>
            </View>
            <View style={styles.orderedInfo}>
              <Text style={styles.orderedLabel}>Ordered Today</Text>
              <Text style={styles.orderedValue}>{orderedToday}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min((remainingQty / TOTAL_STOCK) * 100, 100)}%`,
                  backgroundColor: getAvailabilityColor(remainingQty),
                }
              ]}
            />
          </View>

          <View style={styles.levelsRow}>
            <Text style={styles.levelText}>0</Text>
            <Text style={styles.levelText}>50</Text>
            <Text style={styles.levelText}>100</Text>
            <Text style={styles.levelText}>150</Text>
            <Text style={styles.levelText}>200</Text>
          </View>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    position: 'relative',         // required for absolute child
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  greyedOut: {
    opacity: 0.4,
  },

  // ── Top-right absolute block ──────────────────────────────────────────────
  topRightActions: {
    position: 'absolute',
    top: 8,
    right: -5,
    alignItems: 'center',
    gap: 2,
    zIndex: 10,
  },
  vegIndicatorBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  vegIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Left column ───────────────────────────────────────────────────────────
  leftColumn: {
    alignItems: 'center',
    width: 100,
  },
  thumbnailContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.textDisabled,
    fontWeight: FONT_WEIGHT.medium,
  },
  soldOutBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  imageActions: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
    alignItems: 'center',
  },
  editBtnInline: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutBtnInline: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutBtnText: {
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
  },

  // ── Info area ─────────────────────────────────────────────────────────────
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // paddingRight leaves space so name/price don't slide under the toggle
  nameBlock: {
    flex: 1,
    paddingRight: 52,
  },
  name: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  price: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginTop: 2,
  },

  // ── Availability bar ──────────────────────────────────────────────────────
  availabilityContainer: {
    marginTop: SPACING.sm,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  availabilityLabel: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  availabilityValue: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
  },
  orderedInfo: {
    alignItems: 'flex-end',
  },
  orderedLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderedValue: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  levelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  levelText: {
    fontSize: 8,
    color: COLORS.textDisabled,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default MenuItemCard;