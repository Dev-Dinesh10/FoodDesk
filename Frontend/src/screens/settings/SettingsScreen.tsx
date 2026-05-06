/**
 * @file src/screens/settings/SettingsScreen.tsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>App Settings</List.Subheader>
        <List.Item
          title="Audio Alerts"
          description="Play sound for new orders"
          right={() => <Switch value={isNotificationsEnabled} onValueChange={setIsNotificationsEnabled} />}
        />
        <Divider />
        <List.Item
          title="Print Receipts"
          description="Auto-print on acceptance"
          right={() => <Switch value={false} />}
        />
        <Divider />
        <List.Item
          title="Kitchen Display Mode"
          description="Optimize layout for large screens"
          onPress={() => {}}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
});

export default SettingsScreen;
