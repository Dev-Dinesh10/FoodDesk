import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';
import Layout from '../../components/layout/Layout';

const CounterDisplayScreen = () => {
  const readyTokens = ['A-046', 'A-045', 'A-044', 'A-043', 'A-042', 'A-041'];
  const collectedTokens = ['A-040', 'A-039', 'A-038'];

  return (
    <Layout title="Counter Display" activeBottomTabKey="counter-display">
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Counter display</Text>

        {/* READY SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>READY</Text>
          <View style={[styles.badge, styles.readyBadge]}>
            <Text style={styles.badgeText}>{readyTokens.length}</Text>
          </View>
        </View>
        <View style={styles.grid}>
          {readyTokens.map((token) => (
            <View key={token} style={styles.tokenCardReady}>
              <Text style={styles.tokenTextReady}>{token}</Text>
            </View>
          ))}
        </View>

        {/* RECENTLY COLLECTED SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENTLY COLLECTED</Text>
          <View style={[styles.badge, styles.collectedBadge]}>
            <Text style={styles.badgeText}>{collectedTokens.length}</Text>
          </View>
        </View>
        <View style={styles.grid}>
          {collectedTokens.map((token) => (
            <View key={token} style={styles.tokenCardCollected}>
              <Text style={styles.tokenTextCollected}>{token}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footerInfo}>Manual overrides today: 0/5</Text>
      </ScrollView>
    </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyBadge: {
    backgroundColor: '#10B981',
  },
  collectedBadge: {
    backgroundColor: '#E2E8F0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl * 1.5,
  },
  tokenCardReady: {
    width: '31%', // Approx 3 columns with gap
    backgroundColor: '#ECFDF5',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenTextReady: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: '#059669',
  },
  tokenCardCollected: {
    width: '31%',
    backgroundColor: '#F5F5F4',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenTextCollected: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: '#78716C',
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  footerInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});

export default CounterDisplayScreen;
