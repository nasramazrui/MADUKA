import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { 
  Hourglass, 
  MessageCircle, 
  Home,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AwaitingVerificationScreen = () => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const hourglassAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 0.4, // Simulate 40% progress
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Hourglass rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(hourglassAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();
  }, []);

  const spin = hourglassAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.content}>
        {/* Hourglass Animation */}
        <View style={styles.animationContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Hourglass size={80} color="#F59E0B" strokeWidth={1.5} />
          </Animated.View>
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Malipo Yanangojea Uthibitisho</Text>
          <Text style={styles.subtitle}>Admin wetu wataangalia malipo yako hivi karibuni</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ref:</Text>
            <Text style={styles.infoValue}>MP241014XXXXX</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kiasi:</Text>
            <Text style={[styles.infoValue, { color: '#FF6B35' }]}>TZS 45,000</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Njia:</Text>
            <Text style={styles.infoValue}>M-Pesa Lipa Namba</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Imetumwa:</Text>
            <Text style={styles.infoValue}>Leo 14:32</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Kawaida dakika 5-30</Text>
        </View>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.outlineButton}>
          <MessageCircle size={20} color="#1A1A2E" style={{ marginRight: 10 }} />
          <Text style={styles.outlineButtonText}>Wasiliana Nasi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <Home size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
          <Text style={styles.primaryButtonText}>Rudi Nyumbani</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  animationContainer: {
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    gap: 16,
  },
  outlineButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AwaitingVerificationScreen;
