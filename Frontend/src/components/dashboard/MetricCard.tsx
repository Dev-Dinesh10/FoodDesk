import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

interface MetricCardProps {
  label: string;
  value: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, iconName, iconColor, subtitle }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={iconName} 
            size={20} 
            color={iconColor || COLORS.primary} 
          />
        </View>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  label: {
    flex: 1,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  value: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default MetricCard;

