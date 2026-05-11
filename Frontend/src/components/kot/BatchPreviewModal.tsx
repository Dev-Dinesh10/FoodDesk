import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

interface BatchPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  batch: any;
}

export const BatchPreviewModal: React.FC<BatchPreviewModalProps> = ({ visible, onClose, batch }) => {
  const [currentStatus, setCurrentStatus] = useState('Preparing');

  useEffect(() => {
    if (batch?.status) {
      setCurrentStatus(batch.status);
    }
  }, [batch]);

  const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered'];
  const currentIndex = statuses.indexOf(currentStatus);

  const handleAdvance = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentStatus(statuses[currentIndex + 1]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return '#F59E0B';
      case 'Ready': return '#10B981';
      case 'Pending': return '#6B7280';
      case 'Delayed': return '#EF4444';
      case 'Delivered': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <View style={styles.idRow}>
                <MaterialIcons name="restaurant" size={20} color={COLORS.textPrimary} />
                <Text style={styles.title}>{batch?.id || 'KOT-101'}</Text>
              </View>
              <Text style={styles.subtitle}>
                {batch?.station || 'Hot Counter'} · Created by Ravi (Lead Cook) · {batch?.time || '10:30 AM'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
              </Pressable>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) + '15' }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(currentStatus) }]}>
                  {currentStatus}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionLabel}>Progress</Text>
              <Text style={styles.etaText}>ETA 25 mins</Text>
            </View>
            <View style={styles.progressBar}>
              {statuses.map((status, index) => {
                const isActive = index <= currentIndex;
                return (
                  <View key={status} style={styles.progressSegmentWrap}>
                    <View style={[styles.progressSegment, { backgroundColor: isActive ? COLORS.primary : '#E2E8F0' }]} />
                    <Text style={[styles.segmentLabel, { color: isActive ? COLORS.textPrimary : COLORS.textSecondary }]}>
                      {status.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Items */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionLabel}>ITEMS (4)</Text>

            {/* ✅ FIX: ScrollView with an inner View for gap spacing */}
            <ScrollView
              style={styles.itemsList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.itemsScrollContent}>

                <View style={styles.itemCard}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemName}>Veg Burger × 3</Text>
                    <Text style={styles.itemNote}>Note: Extra cheese</Text>
                  </View>
                  <View style={[styles.itemStatusBadge, { backgroundColor: '#FEF3F2' }]}>
                    <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700' }}>Preparing</Text>
                  </View>
                </View>

                <View style={styles.itemCard}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemName}>Cold Coffee × 2</Text>
                    <Text style={styles.itemNote}>Note: No sugar</Text>
                  </View>
                  <View style={[styles.itemStatusBadge, { backgroundColor: '#E6FFFA' }]}>
                    <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '700' }}>Ready</Text>
                  </View>
                </View>

                <View style={styles.itemCard}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemName}>Pasta × 1</Text>
                    <Text style={styles.itemNote}>Note: Spicy</Text>
                  </View>
                  <View style={[styles.itemStatusBadge, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={{ color: '#6B7280', fontSize: 10, fontWeight: '700' }}>Pending</Text>
                  </View>
                </View>

                <View style={styles.itemCard}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemName}>Dal Rice × 6</Text>
                    <Text style={styles.itemNote}>None</Text>
                  </View>
                  <View style={[styles.itemStatusBadge, { backgroundColor: '#FEF3F2' }]}>
                    <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700' }}>Preparing</Text>
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.printBtn}>
              <MaterialIcons name="print" size={16} color={COLORS.white} />
              <Text style={styles.printBtnText}>Print KOT</Text>
            </Pressable>
            <Pressable style={styles.advanceBtn} onPress={handleAdvance}>
              <MaterialIcons name="play-arrow" size={16} color={COLORS.white} />
              <Text style={styles.advanceBtnText}>Advance status</Text>
            </Pressable>
          </View>

        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrap: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
  },
  closeBtn: {
    padding: 4,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  etaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
  },
  progressSegmentWrap: {
    flex: 1,
    gap: 4,
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  itemsSection: {
    gap: 8,
  },
  // ✅ FIX 1: Removed gap (doesn't work on ScrollView), increased maxHeight
  itemsList: {
    maxHeight: 260,
  },
  // ✅ FIX 2: Inner wrapper View handles the gap between cards
  itemsScrollContent: {
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  itemNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  printBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.bold,
  },
  advanceBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  advanceBtnText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
});