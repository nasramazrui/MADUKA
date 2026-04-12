import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Package, 
  Heart, 
  Star, 
  Trophy, 
  Users, 
  Tag, 
  HelpCircle, 
  Phone, 
  Globe, 
  Moon, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const MenuSection = ({ title, items }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.menuItem, index === items.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.bgColor || '#F3F4F6' }]}>
                {item.icon}
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.value && <Text style={styles.menuItemValue}>{item.value}</Text>}
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Background */}
        <View style={styles.headerBg} />

        {/* Profile Info Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Amour+Rashid&background=1A1A2E&color=fff&size=128' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.name}>Amour Rashid</Text>
          <Text style={styles.phone}>+255 712 345 678</Text>
          
          <View style={styles.pointsBadge}>
            <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.pointsText}>1,240 Pointi</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <MenuSection 
            title="AKAUNTI"
            items={[
              { icon: <User size={20} color="#1A1A2E" />, label: 'Maelezo Yangu' },
              { icon: <MapPin size={20} color="#1A1A2E" />, label: 'Anwani Zilizohifadhiwa' },
              { icon: <CreditCard size={20} color="#1A1A2E" />, label: 'Njia za Malipo' },
              { icon: <Bell size={20} color="#1A1A2E" />, label: 'Arifa' },
            ]}
          />

          <MenuSection 
            title="MANUNUZI"
            items={[
              { icon: <Package size={20} color="#1A1A2E" />, label: 'Historia ya Maagizo' },
              { icon: <Heart size={20} color="#1A1A2E" />, label: 'Vipendwa Vyangu' },
              { icon: <Star size={20} color="#1A1A2E" />, label: 'Hakiki Zangu' },
            ]}
          />

          <MenuSection 
            title="ZAWADI"
            items={[
              { icon: <Trophy size={20} color="#FF6B35" />, label: 'Pointi za Uaminifu', bgColor: 'rgba(255, 107, 53, 0.1)' },
              { icon: <Users size={20} color="#1A1A2E" />, label: 'Mwaliko wa Marafiki' },
              { icon: <Tag size={20} color="#1A1A2E" />, label: 'Kodi za Punguzo' },
            ]}
          />

          <MenuSection 
            title="MSAADA"
            items={[
              { icon: <HelpCircle size={20} color="#1A1A2E" />, label: 'Msaada & Maswali' },
              { icon: <Phone size={20} color="#1A1A2E" />, label: 'Wasiliana Nasi' },
            ]}
          />

          <MenuSection 
            title="APP"
            items={[
              { icon: <Globe size={20} color="#1A1A2E" />, label: 'Lugha', value: 'Kiswahili' },
              { icon: <Moon size={20} color="#1A1A2E" />, label: 'Mwonekano', value: 'Giza' },
            ]}
          />

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Toka</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBg: {
    height: 120,
    backgroundColor: '#FF6B35',
    width: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});

export default ProfileScreen;
