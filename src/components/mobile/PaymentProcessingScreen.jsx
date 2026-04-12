import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { 
  Phone, 
  CheckCircle2, 
  Clock, 
  Circle,
  Loader2,
  XCircle
} from 'lucide-react-native';

const PaymentProcessingScreen = () => {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateRing = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateRing(ring1, 0);
    animateRing(ring2, 600);
    animateRing(ring3, 1200);

    // Spinner animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringStyle = (anim) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 2],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.4, 0],
    }),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Animated Icon Section */}
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.pulseRing, ringStyle(ring1)]} />
          <Animated.View style={[styles.pulseRing, ringStyle(ring2)]} />
          <Animated.View style={[styles.pulseRing, ringStyle(ring3)]} />
          <View style={styles.iconCircle}>
            <Phone size={48} color="#FF6B35" fill="rgba(255, 107, 53, 0.1)" />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Subiri Kidogo...</Text>
          <Text style={styles.subtitle}>Tunakutumia ombi kwa simu yako</Text>
        </View>

        {/* Steps Section */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepRow}>
            <CheckCircle2 size={24} color="#0F9B58" fill="rgba(15, 155, 88, 0.1)" />
            <Text style={[styles.stepText, styles.doneText]}>Ombi limetumwa</Text>
          </View>

          <View style={styles.stepRow}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Loader2 size={24} color="#F59E0B" />
            </Animated.View>
            <Text style={[styles.stepText, styles.activeText]}>Subiri USSD kwenye simu</Text>
          </View>

          <View style={styles.stepRow}>
            <Circle size={24} color="#E5E7EB" />
            <Text style={[styles.stepText, styles.pendingText]}>Ingiza PIN yako</Text>
          </View>

          <View style={styles.stepRow}>
            <Circle size={24} color="#E5E7EB" />
            <Text style={[styles.stepText, styles.pendingText]}>Inathibitishwa...</Text>
          </View>
        </View>

        {/* Timer Section */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Muda unaobaki:</Text>
          <Text style={styles.timerValue}>04:32</Text>
        </View>

        {/* Actions Section */}
        <View style={styles.actions}>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Ninahitaji msaada</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton}>
            <XCircle size={16} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.cancelText}>Futa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 24,
    marginBottom: 40,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  stepText: {
    fontSize: 15,
    fontWeight: '600',
  },
  doneText: {
    color: '#0F9B58',
  },
  activeText: {
    color: '#F59E0B',
  },
  pendingText: {
    color: '#9CA3AF',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF6B35',
  },
  actions: {
    alignItems: 'center',
    gap: 24,
  },
  helpLink: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: 'bold',
  },
});

export default PaymentProcessingScreen;
