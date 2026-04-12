import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { 
  Zap, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Chrome 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Zap size={32} color="#FF6B35" fill="#FF6B35" />
          </View>
          <Text style={styles.logoText}>SwiftApp</Text>
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Karibu Tena!</Text>
          <Text style={styles.subtitle}>Ingia kuendelea</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>+255</Text>
              <View style={styles.divider} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Namba ya Simu"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingLeft: 16 }]}
              placeholder="Nenosiri"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.orangeLink}>Umesahau nenosiri?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Ingia</Text>
          </TouchableOpacity>

          {/* Fingerprint Button */}
          <View style={styles.fingerprintContainer}>
            <TouchableOpacity style={styles.fingerprintButton}>
              <Fingerprint size={28} color="#1A1A2E" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.orDivider}>
            <View style={styles.line} />
            <Text style={styles.orText}>au</Text>
            <View style={styles.line} />
          </View>

          {/* Google Login */}
          <TouchableOpacity style={styles.googleButton}>
            <Chrome size={20} color="#1A1A2E" style={{ marginRight: 10 }} />
            <Text style={styles.googleButtonText}>Ingia na Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Huna akaunti? </Text>
          <TouchableOpacity>
            <Text style={styles.orangeLink}>Jisajili</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A2E',
    marginTop: 12,
    fontStyle: 'italic',
  },
  header: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 52,
    marginBottom: 16,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginRight: 12,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1A1A2E',
    paddingHorizontal: 12,
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  orangeLink: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
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
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  fingerprintButton: {
    width: 52,
    height: 52,
    backgroundColor: '#E5E7EB',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default LoginScreen;
