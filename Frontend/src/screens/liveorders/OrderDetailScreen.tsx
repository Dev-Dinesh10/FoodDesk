/**
 * @file src/screens/liveorders/OrderDetailScreen.tsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const OrderDetailScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Order Details: {orderId}</Text>
      {/* Full screen detail logic would go here */}
      <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
        Back to List
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  button: {
    marginTop: SPACING.xl,
  },
});

export default OrderDetailScreen;
