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
  category: string;
  price: number;
  image?: any;
  isAvailable: boolean;
  isSoldOut: boolean;
  remainingQty: number;
  orderedToday: number;
  onToggleAvailability: () => void;
  onMarkSoldOut: () => void;
  onEdit: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  category,
  price,
  image,
  isAvailable,
  isSoldOut,
  remainingQty,
  orderedToday,
  onToggleAvailability,
  onMarkSoldOut,
  onEdit,
}) => {
  return (
    <View style={[styles.card, !isAvailable && styles.greyedOut]}>
      {/* Thumbnail Area */}
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

      {/* Info Area */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.category}>{category}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>₹{price}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, remainingQty < 10 && { color: COLORS.error }]}>
              {remainingQty}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Ordered</Text>
            <Text style={styles.statValue}>{orderedToday} today</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {!isSoldOut && (
            <TouchableOpacity 
              style={styles.soldOutBtn} 
              onPress={onMarkSoldOut}
            >
              <Text style={styles.soldOutBtnText}>Mark Sold Out</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <View style={styles.toggleWrapper}>
            <Text style={styles.toggleLabel}>{isAvailable ? 'Active' : 'Hidden'}</Text>
            <Switch
              value={isAvailable}
              onValueChange={onToggleAvailability}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }} // Made it slightly smaller
            />
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  greyedOut: {
    opacity: 0.6,
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
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  category: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginTop: 4,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  soldOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  soldOutBtnText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
});

export default MenuItemCard;
