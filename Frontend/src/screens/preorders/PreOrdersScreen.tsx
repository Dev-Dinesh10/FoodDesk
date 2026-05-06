import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import MetricCard from '../../components/dashboard/MetricCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';
import PreOrderItemRow from '../../components/preorders/PreOrderItemRow';

import IngredientModal from '../../components/preorders/IngredientModal';

const PreOrdersScreen = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Dal Rice', totalQty: 142, slots: [89, 34, 12, 7], gmv: '11,360', isUnavailable: false },
    { id: '2', name: 'Chicken Biryani', totalQty: 87, slots: [22, 41, 18, 6], gmv: '15,660', isUnavailable: false },
    { id: '3', name: 'Paneer Masala + Roti', totalQty: 65, slots: [18, 25, 14, 8], gmv: '9,750', isUnavailable: false },
    { id: '4', name: 'Salad', totalQty: 38, slots: [12, 14, 8, 4], gmv: '2,280', isUnavailable: false },
  ]);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isIngredientModalVisible, setIsIngredientModalVisible] = useState(false);

  // Mock data for ingredients
  const ingredientData = [
    {
      itemName: 'Dal Rice',
      portions: 157,
      ingredients: [
        { name: 'Toor dal', qty: '14kg' },
        { name: 'Basmati rice', qty: '28kg' },
        { name: 'Onion', qty: '4kg' },
      ],
    },
    {
      itemName: 'Chicken Biryani',
      portions: 96,
      ingredients: [
        { name: 'Chicken', qty: '22kg' },
        { name: 'Basmati rice', qty: '18kg' },
        { name: 'Yogurt', qty: '6L' },
      ],
    },
    {
      itemName: 'Paneer Masala + Roti',
      portions: 72,
      ingredients: [
        { name: 'Paneer', qty: '8kg' },
        { name: 'Atta', qty: '6kg' },
        { name: 'Tomato', qty: '5kg' },
      ],
    },
    {
      itemName: 'Salad',
      portions: 42,
      ingredients: [
        { name: 'Cucumber', qty: '3kg' },
        { name: 'Tomato', qty: '3kg' },
        { name: 'Lettuce', qty: '2kg' },
      ],
    },
  ];

  const handleFlagUnavailable = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isUnavailable: true } : item));
  };

  const handleConfirmAll = () => {
    Alert.alert(
      'Confirm All Items?',
      'By confirming, you acknowledge that the kitchen will fulfill all listed pre-orders.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm All', onPress: () => setIsConfirmed(true) }
      ]
    );
  };

  const totalOrders = items.reduce((sum, item) => sum + (item.isUnavailable ? 0 : item.totalQty), 0);
  const totalGMV = items.reduce((sum, item) => sum + (item.isUnavailable ? 0 : parseInt(item.gmv.replace(',', ''))), 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tomorrow's Lunch</Text>
          <Text style={styles.subtitle}>Pre-Orders closed at 11:30 AM</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <MetricCard 
            label="Total Pre-Orders" 
            value={totalOrders.toString()} 
            iconName="shopping-basket" 
          />
          <MetricCard 
            label="Estimated GMV" 
            value={`₹${totalGMV.toLocaleString()}`} 
            iconName="payments" 
            iconColor={COLORS.success}
          />
        </View>

        {/* Table Card */}
        <View style={styles.tableCard}>
          <View style={styles.tableCardHeader}>
            <Text style={styles.tableCardTitle}>Item-wise breakdown</Text>
            <View style={styles.flagIndicator}>
              <MaterialIcons name="info-outline" size={14} color={COLORS.textPrimary} />
              <Text style={styles.flagIndicatorText}>Flag non-fulfillable</Text>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCol, styles.nameCol]}>ITEM</Text>
            <Text style={[styles.headerCol, styles.qtyCol]}>QTY</Text>
            <Text style={[styles.headerCol, styles.slotCol]}>12:00</Text>
            <Text style={[styles.headerCol, styles.slotCol]}>12:15</Text>
            <Text style={[styles.headerCol, styles.slotCol]}>12:30</Text>
            <Text style={[styles.headerCol, styles.slotCol]}>12:45</Text>
            <Text style={[styles.headerCol, styles.gmvCol]}>GMV</Text>
          </View>

          {/* Table Body */}
          <View style={styles.tableBody}>
            {items.map(item => (
              <PreOrderItemRow
                key={item.id}
                name={item.name}
                totalQty={item.totalQty}
                slots={item.slots}
                gmv={item.gmv}
                isUnavailable={item.isUnavailable}
                onFlagUnavailable={() => handleFlagUnavailable(item.id)}
              />
            ))}
          </View>
        </View>

        {/* Peak Status Banner */}
        {!isConfirmed && (
          <View style={[styles.banner, styles.infoBanner]}>
            <MaterialIcons name="trending-up" size={20} color={COLORS.lockedBannerText} />
            <Text style={styles.infoBannerText}>
              <Text style={{ fontWeight: FONT_WEIGHT.bold }}>12:15 PM</Text> is your peak slot with 134 orders
            </Text>
          </View>
        )}

        {isConfirmed && (
          <View style={[styles.banner, styles.successBanner]}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.white} />
            <Text style={styles.bannerText}>All items confirmed for Lunch service</Text>
          </View>
        )}

        <View style={styles.comparisonContainer}>
          <Text style={styles.comparisonText}>
            Reference: Yesterday's total was <Text style={{ fontWeight: FONT_WEIGHT.bold }}>284 orders</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionRow}>
          <QuickActionButton 
            label="Ingredient List" 
            onPress={() => setIsIngredientModalVisible(true)} 
          />
          <View style={styles.actionGap} />
          <QuickActionButton 
            label="KOT Batches" 
            onPress={() => Alert.alert('Printing...', 'Creating kitchen order ticket batches.')} 
          />
        </View>
        {!isConfirmed && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAll}>
            <Text style={styles.confirmButtonText}>Confirm All Items</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Ingredient Modal */}
      <IngredientModal
        visible={isIngredientModalVisible}
        onClose={() => setIsIngredientModalVisible(false)}
        data={ingredientData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 140,
  },
  headerSection: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  tableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingVertical: SPACING.md,
  },
  tableCardTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  flagIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIndicatorText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    marginLeft: 4,
    fontWeight: FONT_WEIGHT.medium,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerCol: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: '#94A3B8',
  },
  nameCol: { flex: 2.5 },
  qtyCol: { flex: 1 },
  slotCol: { flex: 0.8, textAlign: 'center' },
  gmvCol: { flex: 1.5, textAlign: 'right' },
  tableBody: {
    backgroundColor: COLORS.surface,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  infoBanner: {
    backgroundColor: COLORS.lockedBannerBg,
    borderWidth: 1,
    borderColor: COLORS.lockedBannerBorder,
  },
  successBanner: {
    backgroundColor: COLORS.success,
  },
  bannerText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  infoBannerText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.lockedBannerText,
  },
  comparisonContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionGap: {
    width: SPACING.sm,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default PreOrdersScreen;

