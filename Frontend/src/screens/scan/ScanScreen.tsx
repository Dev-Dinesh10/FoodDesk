import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  Dimensions,
  Vibration,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY, FONT_WEIGHT } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

type ScanState = 'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR';

const ScanScreen = () => {
  const [state, setState] = useState<ScanState>('IDLE');
  const [tokenInput, setTokenInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [employee, setEmployee] = useState({ name: '', items: '' });

  const rfidPulse = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'IDLE') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rfidPulse, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(rfidPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      rfidPulse.setValue(1);
    }
  }, [state]);

  const triggerResult = (type: 'SUCCESS' | 'ERROR', data?: any) => {
    setState(type);
    if (type === 'SUCCESS') {
      setEmployee({ name: 'Ravi Kumar', items: 'Dal Rice x1, Roti x2' });
      Vibration.vibrate([0, 100]);
    } else {
      setErrorMessage(data || 'Invalid Token');
      Vibration.vibrate([0, 500]);
    }

    // Flash animation
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Auto-reset
    setTimeout(() => {
      Animated.timing(flashAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setState('IDLE');
        setTokenInput('');
      });
    }, 3000);
  };

  const handleManualEntry = () => {
    if (!tokenInput) return;
    // Mock validation logic
    if (tokenInput === 'A-047') {
      triggerResult('SUCCESS');
    } else if (tokenInput === 'A-040') {
      triggerResult('ERROR', 'This order was already picked up at 12:33 PM — Counter 2');
    } else {
      triggerResult('ERROR', 'Subscription inactive — refer to HR');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Collection Validation</Text>

        {/* Central Scan Area */}
        <View style={styles.scanArea}>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => triggerResult('SUCCESS')}
          >
            <MaterialIcons name="qr-code-scanner" size={80} color={COLORS.primary} />
            <Text style={styles.scanBtnText}>Tap to Scan QR</Text>
          </TouchableOpacity>

          {/* RFID Zone */}
          <View style={styles.rfidZone}>
            <Animated.View style={[styles.rfidPulse, { transform: [{ scale: rfidPulse }] }]} />
            <View style={styles.rfidCore}>
              <MaterialIcons name="nfc" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.rfidLabel}>Tap RFID Card Here</Text>
          </View>
        </View>

        {/* Manual Fallback */}
        <View style={styles.fallbackArea}>
          <Text style={styles.fallbackTitle}>Manual Entry Fallback</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter Token Number (e.g. A-047)"
              placeholderTextColor="#94A3B8"
              value={tokenInput}
              onChangeText={setTokenInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.goBtn} onPress={handleManualEntry}>
              <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUCCESS OVERLAY */}
        {state === 'SUCCESS' && (
          <Animated.View style={[styles.fullOverlay, styles.successOverlay, { opacity: flashAnim }]}>
            <MaterialIcons name="check-circle" size={120} color={COLORS.white} />
            <Text style={styles.resultTitle}>VALID SCAN</Text>
            <View style={styles.resultCard}>
              <Text style={styles.empName}>{employee.name}</Text>
              <Text style={styles.itemsList}>{employee.items}</Text>
              <View style={styles.divider} />
              <Text style={styles.statusText}>FOOD RELEASED</Text>
            </View>
          </Animated.View>
        )}

        {/* ERROR OVERLAY */}
        {state === 'ERROR' && (
          <Animated.View style={[styles.fullOverlay, styles.errorOverlay, { opacity: flashAnim }]}>
            <MaterialIcons name="cancel" size={120} color={COLORS.white} />
            <Text style={styles.resultTitle}>INVALID SCAN</Text>
            <View style={styles.resultCard}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
  },
  scanButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  scanBtnText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  rfidZone: {
    alignItems: 'center',
  },
  rfidCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  rfidPulse: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    zIndex: 1,
  },
  rfidLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: FONT_WEIGHT.medium,
  },
  fallbackArea: {
    marginBottom: SPACING.lg,
  },
  fallbackTitle: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  goBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    zIndex: 100,
  },
  successOverlay: {
    backgroundColor: '#10B981',
  },
  errorOverlay: {
    backgroundColor: '#EF4444',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 20,
    letterSpacing: 2,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    padding: 24,
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  empName: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  itemsList: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default ScanScreen;
