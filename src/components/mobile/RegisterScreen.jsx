import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Gift,
  CheckCircle2,
  Circle
} from 'lucide-react-native';

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.headerNav}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={28} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Fungua Akaunti</Text>
          <Text style={styles.subtitle}>Jisajili kwa sekunde chache</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <User size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Jina Kamili"
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#6B7280" style={styles.inputIcon} />
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>+255</Text>
              <View style={styles.divider} />
            </View>
            <TextInput
              style={[styles.input, { paddingLeft: 12 }]}
              placeholder="Namba ya Simu"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Barua Pepe (optional)"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nenosiri"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Thibitisha Nenosiri"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          {/* Invite Code Collapsible */}
          <TouchableOpacity 
            style={styles.inviteToggle}
            onPress={() => setShowInviteCode(!showInviteCode)}
          >
            <View style={styles.inviteHeader}>
              <Gift size={20} color="#FF6B35" />
              <Text style={styles.inviteText}>Una msimbo wa mwaliko?</Text>
            </View>
          </TouchableOpacity>

          {showInviteCode && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { paddingLeft: 16 }]}
                placeholder="Msimbo wa Mwaliko"
                placeholderTextColor="#6B7280"
              />
            </View>
          )}

          {/* Terms Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            {agreed ? (
              <CheckCircle2 size={22} color="#FF6B35" fill="#FF6B35" />
            ) : (
              <Circle size={22} color="#E5E7EB" />
            )}
            <Text style={styles.checkboxText}>
              Nakubali <Text style={styles.orangeText}>Masharti</Text> na <Text style={styles.orangeText}>Sera ya Faragha</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Jisajili</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Una akaunti? </Text>
          <TouchableOpacity>
            <Text style={styles.orangeLink}>Ingia</Text>
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
  headerNav: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 52,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginRight: 12,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1A1A2E',
  },
  inviteToggle: {
    marginBottom: 16,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    gap: 12,
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  orangeText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  registerButton: {
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  orangeLink: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default RegisterScreen;
