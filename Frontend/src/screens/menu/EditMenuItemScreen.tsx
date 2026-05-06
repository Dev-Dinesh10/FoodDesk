/**
 * @file src/screens/menu/EditMenuItemScreen.tsx
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const EditMenuItemScreen = ({ route }: any) => {
  const { itemId } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <TextInput label="Item Name" mode="outlined" style={styles.input} />
      <TextInput label="Price" mode="outlined" keyboardType="numeric" style={styles.input} />
      <TextInput label="Description" mode="outlined" multiline numberOfLines={4} style={styles.input} />
      
      <Button mode="contained" onPress={() => {}} style={styles.saveButton}>
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.lg,
  },
  saveButton: {
    marginTop: SPACING.xl,
    borderRadius: 8,
  },
});

export default EditMenuItemScreen;
