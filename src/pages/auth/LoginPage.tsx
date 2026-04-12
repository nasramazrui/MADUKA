import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setFirebaseUser } = useAuthStore();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Tafadhali jaza barua pepe/namba ya simu na nenosiri');
      return;
    }

    setLoading(true);
    try {
      let email = identifier;
      let formattedPhone = '';

      // Check if identifier is an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      
      if (!isEmail) {
        // Assume it's a phone number
        const cleanPhone = identifier.replace(/\D/g, '');
        formattedPhone = cleanPhone.startsWith('255') ? cleanPhone : `255${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
        email = `${formattedPhone}@swiftapp.com`;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setFirebaseUser(firebaseUser);

      // Sync with backend
      const response = await api.post('/auth/sync', {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        phone: formattedPhone || undefined
      });

      const userData = response.data;
      setUser(userData);

      toast.success(`Karibu tena, ${userData.name}`);

      // Redirect based on role
      if (userData.role === 'ADMIN') navigate('/admin');
      else if (userData.role === 'VENDOR') navigate('/vendor');
      else if (userData.role === 'DRIVER') navigate('/driver');
      else navigate('/home');

    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Imeshindwa kuingia. Tafadhali angalia taarifa zako.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Barua pepe/Namba ya simu au nenosiri si sahihi';
      } else if (error.code === 'auth/internal-error' && error.message.includes('identitytoolkit')) {
        message = 'Mfumo wa uthibitisho haujawashwa. Tafadhali wasiliana na admin.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      setFirebaseUser(firebaseUser);

      const response = await api.post('/auth/sync', {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        profilePhoto: firebaseUser.photoURL
      });

      const userData = response.data;
      setUser(userData);

      toast.success(`Karibu tena, ${userData.name}`);
      
      if (userData.role === 'ADMIN') navigate('/admin');
      else if (userData.role === 'VENDOR') navigate('/vendor');
      else if (userData.role === 'DRIVER') navigate('/driver');
      else navigate('/home');

    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Imeshindwa kuingia na Google');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FF6B35]/20 to-[#F8F9FA]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] bg-white rounded-[32px] shadow-xl shadow-black/5 p-8 md:p-12"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-[60px] h-[60px] bg-[#FF6B35] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#FF6B35]/30">
            <span className="text-white text-3xl font-black italic">S</span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Karibu SwiftApp</h1>
          <p className="text-[#6B7280] text-sm mt-1">Ingia ili kuendelea</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Identifier Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1A1A2E] ml-1">Barua Pepe au Namba ya Simu</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                <Phone size={20} />
              </div>
              <Input
                type="text"
                placeholder="Email au 07XXXXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-[52px] pl-12 rounded-2xl border-[#E5E7EB] focus:border-[#FF6B35] focus:ring-[#FF6B35]/10 font-bold"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-[#1A1A2E]">Nenosiri</label>
              <Link to="/forgot-password" title="Umesahau nenosiri?" className="text-xs font-bold text-[#FF6B35] hover:underline">
                Umesahau nenosiri?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                <Lock size={20} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[52px] pl-12 pr-12 rounded-2xl border-[#E5E7EB] focus:border-[#FF6B35] focus:ring-[#FF6B35]/10 font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-[52px] bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] hover:from-[#FF8C61] hover:to-[#FF6B35] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#FF6B35]/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                Ingia <ArrowRight size={20} />
              </div>
            )}
          </Button>
        </form>

        {/* Biometrics & Divider */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <button className="w-12 h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#F8F9FA] transition-colors">
            <Fingerprint size={24} />
          </button>

          <div className="w-full flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-[#E5E7EB]"></div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">au</span>
            <div className="h-[1px] flex-1 bg-[#E5E7EB]"></div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-[52px] rounded-2xl border-[#E5E7EB] font-bold text-[#1A1A2E] flex items-center justify-center gap-3 hover:bg-[#F8F9FA]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Ingia na Google
          </Button>

          <p className="text-sm font-bold text-[#6B7280]">
            Huna akaunti?{' '}
            <Link to="/register" className="text-[#FF6B35] hover:underline">
              Jisajili
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
