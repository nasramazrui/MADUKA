import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Bike,
  Utensils,
  Home,
  Check
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const OrderTrackingScreen = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(height * 0.4)).current; // Bottom sheet height

  useEffect(() => {
    // Pulse animation for the status badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Full Screen Map Simulation */}
      <View style={styles.mapContainer}>
        {/* Simulated Map Background */}
        <View style={styles.mapBackground}>
          {/* Simulated Route Line */}
          <View style={styles.routeLine} />
          
          {/* Restaurant Pin */}
          <View style={[styles.pin, styles.restaurantPin]}>
            <View style={styles.pinCircle}>
              <Utensils size={14} color="#FFFFFF" />
            </View>
            <View style={styles.pinTriangle} />
          </View>

          {/* Home Pin */}
          <View style={[styles.pin, styles.homePin]}>
            <View style={[styles.pinCircle, { backgroundColor: '#3B82F6' }]}>
              <Home size={14} color="#FFFFFF" />
            </View>
            <View style={[styles.pinTriangle, { borderTopColor: '#3B82F6' }]} />
          </View>

          {/* Rider Pin */}
          <View style={[styles.pin, styles.riderPin]}>
            <View style={styles.riderPinCircle}>
              <Bike size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.pinTriangle, { borderTopColor: '#FF6B35' }]} />
          </View>
        </View>

        {/* Back Button */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ChevronLeft size={28} color="#1A1A2E" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, { height: sheetAnim }]}>
        <View style={styles.dragIndicator} />
        
        <View style={styles.sheetContent}>
          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>
            <Animated.View style={[styles.statusBadge, { opacity: pulseAnim }]}>
              <Text style={styles.statusText}>Inakuja Kwako</Text>
            </Animated.View>
          </View>

          {/* ETA Section */}
          <Text style={styles.etaText}>Unafika dakika <Text style={styles.etaHighlight}>12</Text></Text>

          {/* Rider Info Row */}
          <View style={styles.riderRow}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Juma+Hassan&background=FF6B35&color=fff' }} 
              style={styles.riderAvatar} 
            />
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Juma Hassan</Text>
              <Text style={styles.riderDetails}>⭐ 4.9 • Pikipiki T123 ABC</Text>
            </View>
            <View style={styles.riderActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Phone size={20} color="#1A1A2E" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MessageSquare size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Timeline Section */}
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.dotDone]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>Imechukuliwa</Text>
                <Text style={styles.timelineTime}>14:48</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.dotActive]}>
                <Animated.View style={[styles.innerDot, { opacity: pulseAnim }]} />
              </View>
              <View style={styles.timelineText}>
                <Text style={[styles.timelineLabel, styles.labelActive]}>Inakuja</Text>
                <Text style={styles.timelineTime}>Sasa hivi</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mapContainer: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routeLine: {
    width: '70%',
    height: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 3,
    opacity: 0.4,
    transform: [{ rotate: '-20deg' }],
    borderStyle: 'dashed',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  pinTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF6B35',
    marginTop: -2,
  },
  restaurantPin: {
    top: '30%',
    left: '15%',
  },
  homePin: {
    bottom: '45%',
    right: '15%',
  },
  riderPin: {
    top: '40%',
    right: '40%',
  },
  riderPinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetContent: {
    padding: 24,
  },
  statusBadgeContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  etaText: {
    fontSize: 24,
    color: '#1A1A2E',
    marginBottom: 24,
  },
  etaHighlight: {
    fontWeight: '900',
    color: '#FF6B35',
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  riderDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  riderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotDone: {
    backgroundColor: '#0F9B58',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
  },
  timelineText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  labelActive: {
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  timelineTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#F3F4F6',
    marginLeft: 9,
    marginVertical: 4,
  },
});

export default OrderTrackingScreen;
