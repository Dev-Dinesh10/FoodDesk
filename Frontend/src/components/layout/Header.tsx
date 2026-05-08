import React from 'react';
import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';


interface HeaderProps {
  title: string;
  onMenuPress: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onMenuPress, 
  onLogout 
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
