import { COLORS } from '../../constants/colors';

export type DayStatus = 'active' | 'holiday' | 'leave' | 'inactive' | 'none';

export interface DayData {
  day: number;
  status: DayStatus;
  hours?: number;
  dateStr?: string; // e.g., "Thu, 30 Apr"
  mealWindows?: string[]; // e.g., ["Breakfast", "Lunch"]
  notes?: string;
}

export const STATUS_CONFIG: Record<
  DayStatus,
  { bg: string; dot: string; label: string; textColor: string }
> = {
  active:   { bg: '#F0FDF4', dot: '#22C55E', label: 'Active',   textColor: '#15803D' },
  holiday:  { bg: '#FEF2F2', dot: '#EF4444', label: 'Holiday',  textColor: '#B91C1C' },
  leave:    { bg: '#FFFBEB', dot: '#F59E0B', label: 'Leave',    textColor: '#B45309' },
  inactive: { bg: '#F8FAFC', dot: '#94A3B8', label: 'Inactive', textColor: '#64748B' },
  none:     { bg: 'transparent', dot: 'transparent', label: '', textColor: COLORS.textSecondary },
};
