import React, { useMemo, useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/dashboard/MetricCard';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_WEIGHT } from '../../constants/typography';

// Import extracted components
import { CalendarView } from '../../components/monthly/CalendarView';
import { ListView } from '../../components/monthly/ListView';
import { SummaryView } from '../../components/monthly/SummaryView';
import { CommonModal } from '../../components/monthly/CommonModal';
import { DropdownModal } from '../../components/monthly/DropdownModal';
import { DayData, DayStatus } from '../../components/monthly/types';

// Constants kept here for navigation or simple UI
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

type ActiveTab = 'calendar' | 'list' | 'summary';

// Helper functions kept here as they are specific to data generation for this screen
function generateMonthData(year: number, month: number): DayData[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const statusPool: DayStatus[] = [
    'active', 'active', 'active', 'active', 'active',
    'active', 'active', 'active', 'leave', 'holiday', 'inactive',
  ];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();
    const dayName = DAY_NAMES[dayOfWeek];
    const monthName = SHORT_MONTHS[month];
    const dateStr = `${dayName}, ${d < 10 ? '0' + d : d} ${monthName}`;

    let status: DayStatus;
    if (dayOfWeek === 0) status = 'holiday';
    else status = statusPool[(d * 3 + month) % statusPool.length];

    return {
      day: d,
      status,
      hours: status === 'active' ? 9 : 0,
      dateStr,
      mealWindows: status === 'active' ? ['Breakfast', 'Lunch', 'Snacks'] : undefined,
      notes: status === 'leave' ? 'Planned absence' : undefined
    };
  });
}

function buildCalendarGrid(year: number, month: number, days: DayData[]) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const totalSlots = firstDayOfWeek + days.length;
  const rows = Math.ceil(totalSlots / 7);
  const grid: (DayData | null)[][] = [];
  let dayIdx = 0;
  for (let r = 0; r < rows; r++) {
    const row: (DayData | null)[] = [];
    for (let c = 0; c < 7; c++) {
      const slot = r * 7 + c;
      if (slot < firstDayOfWeek || dayIdx >= days.length) {
        row.push(null);
      } else {
        row.push(days[dayIdx++]);
      }
    }
    grid.push(row);
  }
  return grid;
}

const MonthlyActivityScreen = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');

  const [days, setDays] = useState<DayData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<DayData | null>(null);

  const [filterVisible, setFilterVisible] = useState(false);
  const [bulkVisible, setBulkVisible] = useState(false);
  const [monthVisible, setMonthVisible] = useState(false);
  const [yearVisible, setYearVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('All statuses');
  const [selectedBulk, setSelectedBulk] = useState('Mark all Active');

  useEffect(() => {
    setDays(generateMonthData(year, month));
  }, [year, month]);

  const grid = useMemo(() => buildCalendarGrid(year, month, days), [year, month, days]);

  const activeDays = days.filter((d) => d.status === 'active').length;
  const leaveDays = days.filter((d) => d.status === 'leave').length;
  const holidayDays = days.filter((d) => d.status === 'holiday').length;
  const totalHours = days.filter((d) => d.status === 'active').reduce((s, d) => s + (d.hours ?? 0), 0);
  const utilization = days.length > 0 ? Math.round((activeDays / days.length) * 100) : 0;

  const handleEditPress = (day: DayData) => {
    setEditingDay(day);
    setIsModalVisible(true);
  };

  const handleSaveActivity = (updatedData: DayData) => {
    setDays(days.map((d) => (d.day === updatedData.day ? updatedData : d)));
  };

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: 'calendar', label: 'Calendar' },
    { key: 'list', label: 'List' },
    { key: 'summary', label: 'Summary' },
  ];

  return (
    <Layout title="Monthly Activity" activeBottomTabKey="">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* New Header Controls Row */}
        <View style={styles.headerControlsRow}>
          {/* Month Dropdown */}
          <Pressable style={styles.dropdownControl} onPress={() => setMonthVisible(true)}>
            <Text style={styles.dropdownControlText}>{SHORT_MONTHS[month]}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textSecondary} />
          </Pressable>

          {/* Year Dropdown */}
          <Pressable style={styles.dropdownControl} onPress={() => setYearVisible(true)}>
            <Text style={styles.dropdownControlText}>{year}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textSecondary} />
          </Pressable>

          {/* Export Button */}
          <Pressable style={styles.exportControlBtn}>
            <MaterialIcons name="file-download" size={16} color={COLORS.textPrimary} />
            <Text style={styles.exportControlBtnText}>Export</Text>
          </Pressable>

          {/* Submit Button */}
          <Pressable style={styles.submitControlBtn}>
            <Text style={styles.submitControlBtnText}>Submit</Text>
          </Pressable>
        </View>



        {/* Stat cards Grid (2->2->1) */}
        <View style={styles.cardsGrid}>
          <MetricCard label="Active Days" value={String(activeDays)} iconName="check-circle" iconColor={COLORS.success} subtitle="Days active" />
          <MetricCard label="Service Hours" value={`${totalHours}Hrs`} iconName="schedule" iconColor={COLORS.primary} subtitle="Total logged" />
          <MetricCard label="Leave Days" value={String(leaveDays)} iconName="event-busy" iconColor={COLORS.warning} subtitle="Planned leaves" />
          <MetricCard label="Holidays" value={String(holidayDays)} iconName="calendar-today" iconColor="#EF4444" subtitle="Public holidays" />
          <MetricCard label="Total Days" value={String(days.length)} iconName="trending-up" iconColor="#8B5CF6" subtitle="Calendar days" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Filter & Action Row */}
        <View style={styles.filterActionRow}>
          <View style={styles.filterGroup}>
            <MaterialIcons name="filter-list" size={16} color={COLORS.textSecondary} />
            <Text style={styles.filterTitle}>Filter</Text>
            <Pressable style={styles.dropdown} onPress={() => setFilterVisible(true)}>
              <Text style={styles.dropdownLabel}>{selectedFilter}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <Pressable style={[styles.dropdown, styles.bulkDropdown]} onPress={() => setBulkVisible(true)}>
            <Text style={[styles.dropdownLabel, { color: COLORS.primary }]}>{selectedBulk}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* Tab content */}
        {activeTab === 'calendar' && (
          <CalendarView grid={grid} onDayPress={handleEditPress} selectedFilter={selectedFilter} />
        )}
        {activeTab === 'list' && (
          <ListView
            days={selectedFilter === 'All statuses' ? days : days.filter(d => d.status.toLowerCase() === selectedFilter.toLowerCase())}
            onEdit={handleEditPress}
          />
        )}
        {activeTab === 'summary' && <SummaryView days={days} />}
      </ScrollView>

      <CommonModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={editingDay}
        onSave={handleSaveActivity}
      />

      <DropdownModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        options={['All statuses', 'Active', 'Inactive', 'Leave', 'Holiday']}
        onSelect={setSelectedFilter}
        selectedValue={selectedFilter}
        title="Filter by status"
      />

      <DropdownModal
        visible={bulkVisible}
        onClose={() => setBulkVisible(false)}
        options={['Mark all Active', 'Mark all Inactive', 'Mark all Leave', 'Mark all Holiday']}
        onSelect={setSelectedBulk}
        selectedValue={selectedBulk}
        title="Bulk action"
      />

      <DropdownModal
        visible={yearVisible}
        onClose={() => setYearVisible(false)}
        options={['2026', '2027', '2028', '2029']}
        onSelect={(val) => setYear(Number(val))}
        selectedValue={String(year)}
        title="Select Year"
      />

      <DropdownModal
        visible={monthVisible}
        onClose={() => setMonthVisible(false)}
        options={SHORT_MONTHS}
        onSelect={(val) => setMonth(SHORT_MONTHS.indexOf(val))}
        selectedValue={SHORT_MONTHS[month]}
        title="Select Month"
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  yearLabel: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  headerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  dropdownControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    gap: 4,
  },
  dropdownControlText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  exportControlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
  },
  exportControlBtnText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  submitControlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  submitControlBtnText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  filterActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    minWidth: 110,
  },
  bulkDropdown: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7ED',
  },
  dropdownLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  yearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  exportBtnText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  submitBtnText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default MonthlyActivityScreen;
