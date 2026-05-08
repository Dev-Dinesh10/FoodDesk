import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import MenuItemCard from '../../components/menu/MenuItemCard';
import EditItemModal from '../../components/menu/EditItemModal';
import AddItemModal from '../../components/menu/AddItemModal';
import MenuItemDetailsModal from '../../components/menu/MenuItemDetailsModal';

// Local Image Assets
const IMAGES = {
  biryani: require('../../../assets/chickenBiriyani.jpeg'),
  dalrice: require('../../../assets/dalrice.jpg'),
  icecream: require('../../../assets/Ice-cream.jpeg'),
  paneer: require('../../../assets/PaneerRoti.jpg'),
  salad: require('../../../assets/salad.jpg'),
};

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snack', 'Dinner', 'Night'];
const FILTERS = ['All', 'Active Only', 'Sold Out', 'Veg', 'Non-Veg'];

const MenuListScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const [items, setItems] = useState([
    { id: '1', name: 'Dal Rice', category: 'Lunch', price: 120, image: IMAGES.dalrice, isAvailable: true, isSoldOut: false, orderedToday: 142, isVegetarian: true },
    { id: '2', name: 'Chicken Biryani', category: 'Lunch', price: 240, image: IMAGES.biryani, isAvailable: true, isSoldOut: false, orderedToday: 87, isVegetarian: false },
    { id: '3', name: 'Paneer Masala + Roti', category: 'Dinner', price: 180, image: IMAGES.paneer, isAvailable: true, isSoldOut: false, orderedToday: 65, isVegetarian: true },
    { id: '4', name: 'Garden Salad', category: 'Snack', price: 90, image: IMAGES.salad, isAvailable: false, isSoldOut: false, orderedToday: 15, isVegetarian: true },
    { id: '5', name: 'Chocolate Ice Cream', category: 'Snack', price: 60, image: IMAGES.icecream, isAvailable: true, isSoldOut: true, orderedToday: 55, isVegetarian: true },
  ]);

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const markSoldOut = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isSoldOut: true } : item
    ));
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  const handleSave = (updatedItem: any) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsEditModalVisible(false);
  };

  const handleAddItem = (newItem: any) => {
    setItems(prev => [newItem, ...prev]);
    setIsAddModalVisible(false);
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const filterMatch = 
      activeFilter === 'All' || 
      (activeFilter === 'Active Only' && item.isAvailable && !item.isSoldOut) ||
      (activeFilter === 'Sold Out' && item.isSoldOut) ||
      (activeFilter === 'Veg' && item.isVegetarian) ||
      (activeFilter === 'Non-Veg' && !item.isVegetarian);
    return categoryMatch && filterMatch;
  });

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.tab, activeCategory === cat && styles.activeTab]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.tabText, activeCategory === cat && styles.activeTabText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {FILTERS.map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MenuItemCard
            name={item.name}
            price={item.price}
            image={item.image}
            isAvailable={item.isAvailable}
            isSoldOut={item.isSoldOut}
            orderedToday={item.orderedToday}
            isVegetarian={item.isVegetarian}
            onToggleAvailability={() => toggleAvailability(item.id)}
            onMarkSoldOut={() => markSoldOut(item.id)}
            onEdit={() => handleEdit(item)}
            onPress={() => {
              setSelectedItem(item);
              setIsDetailsModalVisible(true);
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#E2E8F0" />
            <Text style={styles.emptyText}>No items found matching filters</Text>
          </View>
        }
      />

      {/* Add Button (Reduced size) */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsAddModalVisible(true)}>
        <MaterialIcons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      {/* Details Modal */}
      <MenuItemDetailsModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        item={selectedItem}
        onEdit={() => {
          setIsDetailsModalVisible(false);
          setIsEditModalVisible(true);
        }}
      />

      {/* Edit Modal */}
      <EditItemModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        item={selectedItem}
        onSave={handleSave}
      />

      {/* Add Modal */}
      <AddItemModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabScroll: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 20,
  },
  tab: {
    paddingBottom: 4,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: '#FFF5ED',
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  activeFilterText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 52, // Reduced size
    height: 52, // Reduced size
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default MenuListScreen;

