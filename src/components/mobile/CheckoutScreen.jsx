import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { 
  ChevronLeft, 
  MapPin, 
  Pencil, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Copy,
  Upload,
  QrCode,
  CheckCircle2,
  Circle
} from 'lucide-react-native';

const CheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('mongike');
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={28} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Malipo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Anwani ya Delivery</Text>
            <TouchableOpacity>
              <Pencil size={18} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.iconCircle}>
              <MapPin size={20} color="#FF6B35" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Nyumbani</Text>
              <Text style={styles.addressText}>Mtaa wa Morocco, Kinondoni, Dar es Salaam</Text>
            </View>
          </View>
        </View>

        {/* Order Summary Collapsible */}
        <TouchableOpacity 
          style={styles.summaryToggle}
          onPress={() => setSummaryExpanded(!summaryExpanded)}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Muhtasari wa Agizo</Text>
            <Text style={styles.summaryCount}>3 Bidhaa</Text>
          </View>
          {summaryExpanded ? (
            <ChevronUp size={20} color="#6B7280" />
          ) : (
            <ChevronDown size={20} color="#6B7280" />
          )}
        </TouchableOpacity>

        {summaryExpanded && (
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Jumla ya Bidhaa</Text>
              <Text style={styles.summaryValue}>TZS 42,500</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ada ya Delivery</Text>
              <Text style={styles.summaryValue}>TZS 2,500</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>JUMLA</Text>
              <Text style={styles.totalValue}>TZS 45,000</Text>
            </View>
          </View>
        )}

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Chagua Njia ya Malipo</Text>

          {/* CARD A: Mobile Money */}
          <TouchableOpacity 
            style={[styles.paymentCard, paymentMethod === 'mongike' && styles.activeCard]}
            onPress={() => setPaymentMethod('mongike')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.radioContainer}>
                {paymentMethod === 'mongike' ? (
                  <CheckCircle2 size={22} color="#FF6B35" fill="#FF6B35" />
                ) : (
                  <Circle size={22} color="#E5E7EB" />
                )}
                <Text style={styles.cardTitle}>Mobile Money (Mongike)</Text>
              </View>
            </View>
            
            {paymentMethod === 'mongike' && (
              <View style={styles.cardContent}>
                <View style={styles.logoTabs}>
                  <View style={styles.logoItem}><Text style={styles.logoText}>M-Pesa</Text></View>
                  <View style={styles.logoItem}><Text style={styles.logoText}>Tigo</Text></View>
                  <View style={styles.logoItem}><Text style={styles.logoText}>Airtel</Text></View>
                </View>
                <TextInput 
                  style={styles.phoneInput}
                  value="0712 345 678"
                  editable={false}
                />
                <View style={styles.secureBadge}>
                  <ShieldCheck size={14} color="#0F9B58" />
                  <Text style={styles.secureText}>Salama na Mongike ✓</Text>
                </View>
                <Text style={styles.cardSubtitle}>Utapata USSD kwenye simu yako</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* CARD B: Lipa Namba */}
          <TouchableOpacity 
            style={[styles.paymentCard, paymentMethod === 'lipanamba' && styles.activeCard]}
            onPress={() => setPaymentMethod('lipanamba')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.radioContainer}>
                {paymentMethod === 'lipanamba' ? (
                  <CheckCircle2 size={22} color="#FF6B35" fill="#FF6B35" />
                ) : (
                  <Circle size={22} color="#E5E7EB" />
                )}
                <Text style={styles.cardTitle}>Lipa kwa Namba</Text>
              </View>
            </View>

            {paymentMethod === 'lipanamba' && (
              <View style={styles.cardContent}>
                <View style={styles.nambaRow}>
                  <Text style={styles.nambaLabel}>M-Pesa: <Text style={styles.nambaValue}>123456</Text></Text>
                  <TouchableOpacity><Copy size={16} color="#FF6B35" /></TouchableOpacity>
                </View>
                <View style={styles.nambaRow}>
                  <Text style={styles.nambaLabel}>Tigo: <Text style={styles.nambaValue}>654321</Text></Text>
                  <TouchableOpacity><Copy size={16} color="#FF6B35" /></TouchableOpacity>
                </View>
                <View style={styles.instructions}>
                  <Text style={styles.instructionText}>1. Lipa nje ya app</Text>
                  <Text style={styles.instructionText}>2. Rudi hapa na weka ID</Text>
                </View>
                <TextInput 
                  style={styles.idInput}
                  placeholder="Weka Namba ya Muamala (Transaction ID)"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity style={styles.uploadButton}>
                  <Upload size={18} color="#6B7280" />
                  <Text style={styles.uploadText}>Pakia Picha ya Malipo</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* CARD C: QR Code */}
          <TouchableOpacity 
            style={[styles.paymentCard, paymentMethod === 'qr' && styles.activeCard]}
            onPress={() => setPaymentMethod('qr')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.radioContainer}>
                {paymentMethod === 'qr' ? (
                  <CheckCircle2 size={22} color="#FF6B35" fill="#FF6B35" />
                ) : (
                  <Circle size={22} color="#E5E7EB" />
                )}
                <Text style={styles.cardTitle}>Scan QR Code</Text>
              </View>
            </View>

            {paymentMethod === 'qr' && (
              <View style={styles.cardContent}>
                <View style={styles.qrContainer}>
                  <View style={styles.qrPlaceholder}>
                    <QrCode size={120} color="#1A1A2E" />
                  </View>
                  <Text style={styles.qrHint}>Gonga kukuza</Text>
                </View>
                <TextInput 
                  style={styles.idInput}
                  placeholder="Weka Namba ya Muamala"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity style={styles.uploadButton}>
                  <Upload size={18} color="#6B7280" />
                  <Text style={styles.uploadText}>Pakia Picha ya Malipo</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Tuma Agizo — TZS 45,000</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  summaryCount: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  summaryDetails: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: -16,
    marginBottom: 24,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF6B35',
  },
  paymentSection: {
    marginBottom: 40,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 12,
  },
  activeCard: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  cardContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  logoItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  phoneInput: {
    backgroundColor: '#F9FAFB',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  secureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F9B58',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  nambaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nambaLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  nambaValue: {
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  instructions: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  idInput: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
