import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ChevronRight,
  Navigation
} from 'lucide-react-native';

const OrderConfirmedScreen = () => {
  const checkScale = useRef(new Animated.Value(0)).current;
  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Checkmark animation
    Animated.spring(checkScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Active step pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(stepAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(stepAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <View style={styles.successHeader}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
            <Check size={48} color="#FFFFFF" strokeWidth={4} />
          </Animated.View>
          <Text style={styles.title}>Agizo Limekubaliwa! 🎉</Text>
          <Text style={styles.orderNumber}>#SW-2024-0042</Text>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#6B7280" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Muda wa Kufika</Text>
              <Text style={styles.infoValue}>Dakika 25-35</Text>
            </View>
          </View>
        </View>

        {/* Mini Map Preview */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            {/* Simulated Map Route */}
            <View style={styles.routeLine} />
            <View style={[styles.pin, styles.restaurantPin]}>
              <View style={styles.pinCircle}><Navigation size={12} color="#FFFFFF" /></View>
            </View>
            <View style={[styles.pin, styles.homePin]}>
              <View style={[styles.pinCircle, { backgroundColor: '#3B82F6' }]}><MapPin size={12} color="#FFFFFF" /></View>
            </View>
          </View>
        </View>

        {/* Rider Card */}
        <View style={styles.riderCard}>
          <View style={styles.riderHeader}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Juma+Hassan&background=FF6B35&color=fff' }} 
              style={styles.riderAvatar} 
            />
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Juma Hassan</Text>
              <View style={styles.riderRating}>
                <Text style={styles.ratingText}>⭐ 4.9</Text>
                <Text style={styles.bikeText}> • Pikipiki: T123 ABC</Text>
              </View>
            </View>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={18} color="#1A1A2E" />
              <Text style={styles.actionText}>Piga Simu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageSquare size={18} color="#1A1A2E" />
              <Text style={styles.actionText}>Ongea</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Steps */}
        <View style={styles.statusSection}>
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.doneStep]}>
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.stepTextDone}>Imethibitishwa</Text>
          </View>
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.doneStep]}>
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.stepTextDone}>Inaandaliwa</Text>
          </View>
          <View style={styles.stepLine} />

          <View style={styles.step}>
            <Animated.View style={[styles.stepDot, styles.activeStep, { opacity: stepAnim }]} />
            <Text style={styles.stepTextActive}>Imechukuliwa</Text>
          </View>
          <View style={[styles.stepLine, styles.pendingLine]} />

          <View style={styles.step}>
            <View style={[styles.stepDot, styles.pendingStep]} />
            <Text style={styles.stepTextPending}>Inakuja Kwako</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Fuatilia Agizo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F9B58',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0F9B58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  deliveryInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  mapContainer: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeLine: {
    width: '60%',
    height: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    opacity: 0.3,
  },
  pin: {
    position: 'absolute',
  },
  restaurantPin: {
    left: '20%',
    top: '40%',
  },
  homePin: {
    right: '20%',
    bottom: '40%',
  },
  pinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  riderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  riderRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  bikeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  riderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  statusSection: {
    paddingLeft: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneStep: {
    backgroundColor: '#0F9B58',
  },
  activeStep: {
    backgroundColor: '#FF6B35',
  },
  pendingStep: {
    backgroundColor: '#E5E7EB',
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: '#0F9B58',
    marginLeft: 11,
    marginVertical: 4,
  },
  pendingLine: {
    backgroundColor: '#E5E7EB',
  },
  stepTextDone: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  stepTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  stepTextPending: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  footer: {
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  outlineButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderConfirmedScreen;
