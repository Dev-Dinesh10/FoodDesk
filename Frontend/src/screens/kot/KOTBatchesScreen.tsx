import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import Layout from '../../components/layout/Layout';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';
import MetricCard from '../../components/dashboard/MetricCard';
import { DropdownModal } from '../../components/monthly/DropdownModal';
import { CreateBatchModal } from '../../components/kot/CreateBatchModal';
import { BatchPreviewModal } from '../../components/kot/BatchPreviewModal';
import { MaterialIcons } from '@expo/vector-icons';

// Mock Data
const MOCK_BATCHES = [
  { id: 'KOT-101', priority: 'high', station: 'Hot Counter', items: 12, time: '10:30 AM', duration: '25m', status: 'Preparing' },
  { id: 'KOT-102', priority: 'normal', station: 'Tandoor', items: 12, time: '11:00 AM', duration: '15m', status: 'Ready' },
  { id: 'KOT-103', priority: 'normal', station: 'Cold Counter', items: 5, time: '11:20 AM', duration: '20m', status: 'Pending' },
  { id: 'KOT-104', priority: 'high', station: 'Hot Counter', items: 14, time: '09:55 AM', duration: '18m', status: 'Delayed' },
  { id: 'KOT-099', priority: 'normal', station: 'Beverage', items: 12, time: '09:10 AM', duration: '4m', status: 'Delivered' },
];

const KOTBatchesScreen = () => {
  const [search, setSearch] = useState('');
  const [batches, setBatches] = useState(MOCK_BATCHES);
  const [statusVisible, setStatusVisible] = useState(false);
  const [stationVisible, setStationVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All status');
  const [selectedStation, setSelectedStation] = useState('All stations');
  const [createVisible, setCreateVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const handleAction = (id: string) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === id) {
        if (batch.status === 'Pending') return { ...batch, status: 'Preparing' };
        if (batch.status === 'Preparing' || batch.status === 'Delayed') return { ...batch, status: 'Ready' };
        if (batch.status === 'Ready') return { ...batch, status: 'Delivered' };
      }
      return batch;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return '#F59E0B';
      case 'Ready': return '#10B981';
      case 'Pending': return '#6B7280';
      case 'Delivered': return '#10B981'; // Green
      default: return '#6B7280';
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'Preparing': return 'Next';
      case 'Ready': return 'Print';
      case 'Pending': return 'Start';
      case 'Delayed': return 'Next';
      case 'Delivered': return 'Done';
      default: return 'Action';
    }
  };

  const getActionColor = (status: string) => {
    switch (status) {
      case 'Preparing': return COLORS.primary; // Primary for Next
      case 'Ready': return '#6B7280'; // Gray for Print
      case 'Pending': return COLORS.primary; // Primary for Start
      case 'Delayed': return COLORS.primary; // Primary for Next
      case 'Delivered': return '#10B981'; // Green for Done
      default: return COLORS.primary;
    }
  };

  return (
    <Layout title="KOT Batches" activeBottomTabKey="">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>KOT Batches</Text>
            <Text style={styles.subtitle}>Manage and track grouped kitchen order batches efficiently.</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.exportBtn}>
              <Text style={styles.exportBtnText}>Export</Text>
            </Pressable>
            <Pressable style={styles.createBtn} onPress={() => setCreateVisible(true)}>
              <Text style={styles.createBtnText}>Create Batches</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats Section Grid */}
        <View style={styles.statsGrid}>
          <MetricCard label="Total Batches" value="5" iconName="layers" iconColor={COLORS.primary} subtitle="All batches" />
          <MetricCard label="Active" value="2" iconName="local-fire-department" iconColor="#F59E0B" subtitle="In progress" />
          <MetricCard label="Completed" value="2" iconName="check-circle" iconColor="#10B981" subtitle="Delivered" />
          <MetricCard label="Delayed" value="1" iconName="warning" iconColor="#EF4444" subtitle="Action needed" />
        </View>

        {/* Search and Filters */}
        <View style={styles.filterCard}>
          <Text style={styles.sectionTitle}>Batch list</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <MaterialIcons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search batch ID"
                value={search}
                onChangeText={setSearch}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>
          <View style={styles.filtersRow}>
            <Pressable style={styles.filterBtn} onPress={() => setStatusVisible(true)}>
              <Text style={styles.filterBtnText}>{selectedStatus}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textPrimary} />
            </Pressable>
            <Pressable style={styles.filterBtn} onPress={() => setStationVisible(true)}>
              <Text style={styles.filterBtnText}>{selectedStation}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* List Section */}
        <View style={styles.listContainer}>
          {batches.map(batch => (
            <Pressable
              key={batch.id}
              style={styles.batchCard}
              onPress={() => {
                setSelectedBatch(batch);
                setPreviewVisible(true);
              }}
            >
              <View style={styles.batchCardHeader}>
                <View style={styles.batchIdWrap}>
                  <Text style={styles.batchId}>{batch.id}</Text>
                  {batch.priority === 'high' && (
                    <View style={styles.highBadge}>
                      <Text style={styles.highBadgeText}>High</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(batch.status) + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(batch.status) }]}>{batch.status}</Text>
                </View>
              </View>

              <View style={styles.batchDetails}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="storefront" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{batch.station}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="restaurant" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{batch.items} Items</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="schedule" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{batch.time} · {batch.duration}</Text>
                </View>

                <Pressable
                  style={[
                    styles.actionBtn,
                    { backgroundColor: getActionColor(batch.status), borderColor: getActionColor(batch.status) === '#E2E8F0' ? '#CBD5E1' : getActionColor(batch.status) }
                  ]}
                  onPress={() => handleAction(batch.id)}
                  disabled={batch.status === 'Delivered'}
                >
                  <Text style={[styles.actionBtnText, { color: getActionColor(batch.status) === '#E2E8F0' ? COLORS.textPrimary : COLORS.white }]}>
                    {getActionText(batch.status)}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <DropdownModal
        visible={statusVisible}
        onClose={() => setStatusVisible(false)}
        options={['All status', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Delayed']}
        onSelect={setSelectedStatus}
        selectedValue={selectedStatus}
        title="Filter by status"
      />

      <DropdownModal
        visible={stationVisible}
        onClose={() => setStationVisible(false)}
        options={['All stations', 'Hot Counter', 'Tandoor', 'Cold Counter', 'Beverage']}
        onSelect={setSelectedStation}
        selectedValue={selectedStation}
        title="Filter by station"
      />

      <CreateBatchModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={(data) => {
          console.log('Create batch:', data);
          setCreateVisible(false);
          // Here you would typically add the new batch to state or API
        }}
      />

      <BatchPreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        batch={selectedBatch}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.max,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  titleWrap: {
    flex: 1,
    minWidth: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  createBtnText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  filterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 40,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 36,
  },
  filterBtnText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  listContainer: {
    gap: SPACING.sm,
  },
  batchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  batchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchIdWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batchId: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  highBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  highBadgeText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: FONT_WEIGHT.bold,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
  },
  batchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  actionBtn: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
  },
  exportBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
});

export default KOTBatchesScreen;
