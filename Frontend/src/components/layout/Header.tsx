import React from 'react';
import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
  onLogout?: () => void;
  isOnline?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onMenuPress, 
  onLogout, 
  isOnline = true 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable onPress={onMenuPress} style={styles.menuButton} accessibilityRole="button">
          <MaterialIcons name="menu" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
        
        {onLogout && (
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineDot: {
    backgroundColor: COLORS.success,
  },
  offlineDot: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
});

export default Header;
