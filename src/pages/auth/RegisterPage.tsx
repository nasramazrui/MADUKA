import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Store, 
  Bike, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  MapPin, 
  Camera,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = 'CUSTOMER' | 'VENDOR' | 'DRIVER';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setFirebaseUser } = useAuthStore();
  
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    // Vendor Specific
    businessName: '',
    businessType: '',
    businessDescription: '',
    tinNumber: '',
    address: '',
    radius: 5,
    medicineType: 'OTC', // OTC, PRESCRIPTION, BOTH
    // Driver Specific
    vehicleType: 'MOTORCYCLE',
    vehicleNumber: '',
    licenseNumber: '',
    // Vendor Documents
    businessLicense: null as File | null,
    businessLicensePreview: '',
    nidaId: null as File | null,
    nidaIdPreview: '',
    businessLogo: null as File | null,
    businessLogoPreview: '',
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (role === 'DRIVER') {
      navigate('/register/driver');
      return;
    }
    if (role === 'VENDOR' && step < 4) {
      setStep(step + 1);
    } else {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRegister = async () => {
    // Basic Validation
    if (!formData.name.trim()) {
      toast.error('Tafadhali jaza jina lako');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Tafadhali jaza namba ya simu');
      return;
    }
    if (!formData.password) {
      toast.error('Tafadhali jaza nenosiri');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Nenosiri lazima liwe na herufi angalau 6');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Nenosiri hazilingani');
      return;
    }

    if (role === 'VENDOR') {
      if (!formData.businessName.trim()) {
        toast.error('Tafadhali jaza jina la biashara');
        return;
      }
      if (!formData.businessType) {
        toast.error('Tafadhali chagua aina ya biashara');
        return;
      }
      if (!formData.businessLicense) {
        toast.error('Tafadhali pakia leseni ya biashara');
        setStep(4);
        return;
      }
      if (!formData.nidaId) {
        toast.error('Tafadhali pakia kitambulisho cha NIDA');
        setStep(4);
        return;
      }
    }

    setLoading(true);
    try {
      // Format phone for Firebase workaround
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 9) {
        toast.error('Namba ya simu si sahihi');
        setLoading(false);
        return;
      }
      const formattedPhone = cleanPhone.startsWith('255') ? cleanPhone : `255${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
      const email = formData.email.trim() || `${formattedPhone}@swiftapp.com`;

      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const firebaseUser = userCredential.user;
      
      // Upload files if vendor
      let businessLicenseUrl = '';
      let nidaIdUrl = '';
      let logoUrl = '';

      if (role === 'VENDOR') {
        if (formData.businessLicense) {
          const licenseRef = ref(storage, `vendors/${firebaseUser.uid}/license_${Date.now()}`);
          await uploadBytes(licenseRef, formData.businessLicense);
          businessLicenseUrl = await getDownloadURL(licenseRef);
        }
        if (formData.nidaId) {
          const nidaRef = ref(storage, `vendors/${firebaseUser.uid}/nida_${Date.now()}`);
          await uploadBytes(nidaRef, formData.nidaId);
          nidaIdUrl = await getDownloadURL(nidaRef);
        }
        if (formData.businessLogo) {
          const logoRef = ref(storage, `vendors/${firebaseUser.uid}/logo_${Date.now()}`);
          await uploadBytes(logoRef, formData.businessLogo);
          logoUrl = await getDownloadURL(logoRef);
        }
      }

      const idToken = await firebaseUser.getIdToken();
      setFirebaseUser(firebaseUser);

      // Sync with backend
      const response = await api.post('/auth/sync', {
        firebaseUid: firebaseUser.uid,
        email: email,
        phone: formattedPhone,
        name: formData.name.trim(),
        role: role,
        // Additional data based on role
        ...(role === 'VENDOR' && {
          businessName: formData.businessName,
          businessType: formData.businessType,
          description: formData.businessDescription,
          tinNumber: formData.tinNumber,
          address: formData.address,
          deliveryRadiusKm: formData.radius,
          businessLicenseUrl,
          nidaIdUrl,
          logoUrl,
          medicineType: formData.medicineType
        }),
        ...(role === 'DRIVER' && {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber
        })
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      setUser(response.data);
      toast.success('Akaunti imetengenezwa! Karibu SwiftApp.');
      
      // Redirect based on role
      if (role === 'VENDOR') navigate('/vendor/pending');
      else if (role === 'DRIVER') navigate('/driver/pending');
      else navigate('/home');

    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Imeshindwa kutengeneza akaunti. Tafadhali jaribu tena.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'Barua pepe hii au namba ya simu tayari imesajiliwa.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Barua pepe si sahihi.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Nenosiri ni dhaifu mno. Tumia herufi angalau 6.';
      } else if (error.code === 'auth/internal-error' || error.message?.includes('identitytoolkit')) {
        message = 'Mfumo wa uthibitisho haujawashwa. Hakikisha "Identity Toolkit API" imewashwa kwenye Firebase Console.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Uthibitisho umekataliwa. Hakikisha domain yako imeruhusiwa kwenye Firebase Console.';
      } else if (error.response?.data?.error) {
        message = `Hitilafu ya mfumo: ${error.response.data.error}`;
      }
      
      toast.error(message, { 
        description: error.code || 'Network Error',
        duration: 5000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-12 px-4">
      {/* Role Selector */}
      {step === 1 && (
        <div className="w-full max-w-[600px] mb-10">
          <h2 className="text-center text-2xl font-black text-[#1A1A2E] mb-8">Chagua Aina ya Akaunti</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'CUSTOMER', label: 'Mteja', icon: User },
              { id: 'VENDOR', label: 'Muuzaji', icon: Store },
              { id: 'DRIVER', label: 'Dereva', icon: Bike },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setRole(item.id as Role)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all ${
                  role === item.id 
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5 shadow-lg shadow-[#FF6B35]/10' 
                    : 'border-white bg-white hover:border-[#FF6B35]/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  role === item.id ? 'bg-[#FF6B35] text-white' : 'bg-[#F8F9FA] text-[#6B7280]'
                }`}>
                  <item.icon size={28} />
                </div>
                <span className={`font-black text-sm ${role === item.id ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`}>
                  {item.label}
                </span>
                {role === item.id && (
                  <motion.div layoutId="active-role" className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-md">
                    <Check size={14} strokeWidth={4} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Card */}
      <motion.div 
        layout
        className="w-full max-w-[520px] bg-white rounded-[32px] shadow-xl shadow-black/5 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A2E]">
                {role === 'CUSTOMER' ? 'Jisajili kama Mteja' : role === 'VENDOR' ? 'Usajili wa Muuzaji' : 'Usajili wa Dereva'}
              </h1>
              {role === 'VENDOR' && (
                <p className="text-sm font-bold text-[#6B7280] mt-1">Hatua ya {step} kati ya 4</p>
              )}
            </div>
            {step > 1 && (
              <button onClick={handleBack} className="p-2 hover:bg-[#F8F9FA] rounded-full text-[#6B7280]">
                <ArrowLeft size={24} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* CUSTOMER FORM */}
              {role === 'CUSTOMER' && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E] ml-1">Jina Kamili</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={e => updateFormData({ name: e.target.value })}
                        className="h-12 rounded-xl border-[#E5E7EB] font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E] ml-1">Namba ya Simu</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#6B7280] border-r pr-3">+255</span>
                        <Input 
                          placeholder="7XXXXXXXX" 
                          value={formData.phone}
                          onChange={e => updateFormData({ phone: e.target.value })}
                          className="h-12 pl-[85px] rounded-xl border-[#E5E7EB] font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E] ml-1">Barua Pepe (Si lazima)</Label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={e => updateFormData({ email: e.target.value })}
                        className="h-12 rounded-xl border-[#E5E7EB] font-bold" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-[#1A1A2E] ml-1">Nenosiri</Label>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={e => updateFormData({ password: e.target.value })}
                          className="h-12 rounded-xl border-[#E5E7EB] font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-[#1A1A2E] ml-1">Thibitisha</Label>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.confirmPassword}
                          onChange={e => updateFormData({ confirmPassword: e.target.value })}
                          className="h-12 rounded-xl border-[#E5E7EB] font-bold" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invite Code Collapsible */}
                  <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => setShowInvite(!showInvite)}
                      className="w-full flex items-center justify-between p-4 bg-[#F8F9FA] hover:bg-white transition-colors"
                    >
                      <span className="text-sm font-bold text-[#1A1A2E]">Una msimbo wa mwaliko?</span>
                      {showInvite ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {showInvite && (
                      <div className="p-4 bg-white border-t border-[#E5E7EB]">
                        <Input 
                          placeholder="Ingiza msimbo hapa" 
                          value={formData.inviteCode}
                          onChange={e => updateFormData({ inviteCode: e.target.value })}
                          className="h-12 rounded-xl border-[#E5E7EB] font-bold uppercase tracking-widest" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 p-1">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#FF6B35] focus:ring-[#FF6B35]" />
                    <label htmlFor="terms" className="text-xs font-medium text-[#6B7280] leading-relaxed">
                      Nimekubali <Link to="/terms" className="text-[#FF6B35] font-bold">Vigezo na Masharti</Link> pamoja na <Link to="/privacy" className="text-[#FF6B35] font-bold">Sera ya Faragha</Link> ya SwiftApp.
                    </label>
                  </div>
                </>
              )}

              {/* VENDOR FORM - STEP 1 */}
              {role === 'VENDOR' && step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Jina la Mmiliki</Label>
                    <Input 
                      placeholder="Jina lako kamili" 
                      value={formData.name}
                      onChange={e => updateFormData({ name: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Namba ya Simu</Label>
                    <Input 
                      placeholder="255XXXXXXXXX" 
                      value={formData.phone}
                      onChange={e => updateFormData({ phone: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Barua Pepe</Label>
                    <Input 
                      type="email" 
                      placeholder="business@example.com" 
                      value={formData.email}
                      onChange={e => updateFormData({ email: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Nenosiri</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={e => updateFormData({ password: e.target.value })}
                        className="h-12 rounded-xl font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Thibitisha</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={e => updateFormData({ confirmPassword: e.target.value })}
                        className="h-12 rounded-xl font-bold" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VENDOR FORM - STEP 2 */}
              {role === 'VENDOR' && step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Jina la Biashara</Label>
                    <Input 
                      placeholder="e.g. Karibu Restaurant" 
                      value={formData.businessName}
                      onChange={e => updateFormData({ businessName: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Aina ya Biashara</Label>
                    <select 
                      value={formData.businessType}
                      onChange={e => updateFormData({ businessType: e.target.value })}
                      className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none"
                    >
                      <option value="">Chagua aina...</option>
                      <option value="RESTAURANT">Mkahawa / Chakula</option>
                      <option value="GROCERY">Grocery / Soko</option>
                      <option value="PHARMACY">Pharmacy</option>
                      <option value="SHOP">Duka la Jumla</option>
                    </select>
                  </div>

                  {formData.businessType === 'PHARMACY' && (
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Aina ya Dawa</Label>
                      <select 
                        value={formData.medicineType}
                        onChange={e => updateFormData({ medicineType: e.target.value })}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none"
                      >
                        <option value="OTC">OTC (Dawa za Kawaida)</option>
                        <option value="PRESCRIPTION">Prescription (Dawa za Cheti)</option>
                        <option value="BOTH">Zote (OTC & Prescription)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Maelezo ya Biashara</Label>
                    <textarea 
                      placeholder="Elezea biashara yako kwa ufupi..." 
                      value={formData.businessDescription}
                      onChange={e => updateFormData({ businessDescription: e.target.value })}
                      className="w-full h-32 rounded-xl border border-[#E5E7EB] p-4 font-bold focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Namba ya TIN (Kama unayo)</Label>
                    <Input 
                      placeholder="XXX-XXX-XXX" 
                      value={formData.tinNumber}
                      onChange={e => updateFormData({ tinNumber: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                </div>
              )}

              {/* VENDOR FORM - STEP 3 */}
              {role === 'VENDOR' && step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Anwani ya Biashara</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
                      <Input 
                        placeholder="e.g. Kinondoni, Dar es Salaam" 
                        value={formData.address}
                        onChange={e => updateFormData({ address: e.target.value })}
                        className="h-12 pl-12 rounded-xl font-bold" 
                      />
                    </div>
                  </div>
                  
                  <div className="h-48 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280]">
                    <MapPin size={32} />
                    <span className="text-sm font-bold">Google Maps Picker Coming Soon</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold text-[#1A1A2E]">Umbali wa Delivery (Radius)</Label>
                      <span className="text-[#FF6B35] font-black">{formData.radius} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={formData.radius}
                      onChange={e => updateFormData({ radius: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                    />
                  </div>
                </div>
              )}

              {/* VENDOR FORM - STEP 4 */}
              {role === 'VENDOR' && step === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Leseni ya Biashara</Label>
                      <div className="h-32 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280] hover:bg-white hover:border-[#FF6B35] transition-all cursor-pointer relative overflow-hidden">
                        {formData.businessLicensePreview ? (
                          <img src={formData.businessLicensePreview} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload size={24} />
                            <span className="text-[10px] font-black uppercase">Pakia</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateFormData({ 
                                businessLicense: file, 
                                businessLicensePreview: URL.createObjectURL(file) 
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Kitambulisho (NIDA)</Label>
                      <div className="h-32 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280] hover:bg-white hover:border-[#FF6B35] transition-all cursor-pointer relative overflow-hidden">
                        {formData.nidaIdPreview ? (
                          <img src={formData.nidaIdPreview} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload size={24} />
                            <span className="text-[10px] font-black uppercase">Pakia</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateFormData({ 
                                nidaId: file, 
                                nidaIdPreview: URL.createObjectURL(file) 
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Logo ya Biashara</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#F8F9FA] rounded-full border-2 border-dashed border-[#E5E7EB] flex items-center justify-center text-[#6B7280] relative overflow-hidden">
                        {formData.businessLogoPreview ? (
                          <img src={formData.businessLogoPreview} className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={24} />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateFormData({ 
                                businessLogo: file, 
                                businessLogoPreview: URL.createObjectURL(file) 
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="relative">
                        <Button variant="outline" className="rounded-xl font-bold">Chagua Picha</Button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateFormData({ 
                                businessLogo: file, 
                                businessLogoPreview: URL.createObjectURL(file) 
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FF6B35]/5 rounded-2xl border border-[#FF6B35]/20 flex gap-3">
                    <ShieldCheck className="text-[#FF6B35] shrink-0" size={24} />
                    <p className="text-xs font-medium text-[#1A1A2E] leading-relaxed">
                      Taarifa zako zitahakikiwa na timu yetu ya usalama ndani ya saa 24. Utapata arifa pindi akaunti yako itakapowashwa.
                    </p>
                  </div>
                </div>
              )}

              {/* DRIVER FORM */}
              {role === 'DRIVER' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Jina Kamili</Label>
                    <Input 
                      placeholder="Jina lako" 
                      value={formData.name}
                      onChange={e => updateFormData({ name: e.target.value })}
                      className="h-12 rounded-xl font-bold" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Aina ya Gari</Label>
                      <select 
                        value={formData.vehicleType}
                        onChange={e => updateFormData({ vehicleType: e.target.value })}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none"
                      >
                        <option value="MOTORCYCLE">Pikipiki</option>
                        <option value="BAJAJ">Bajaj</option>
                        <option value="CAR">Gari</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Namba ya Gari</Label>
                      <Input 
                        placeholder="T 123 ABC" 
                        value={formData.vehicleNumber}
                        onChange={e => updateFormData({ vehicleNumber: e.target.value })}
                        className="h-12 rounded-xl font-bold uppercase" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[#1A1A2E]">Namba ya Leseni</Label>
                    <Input 
                      placeholder="DL-XXXXXXXX" 
                      value={formData.licenseNumber}
                      onChange={e => updateFormData({ licenseNumber: e.target.value })}
                      className="h-12 rounded-xl font-bold uppercase" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Nenosiri</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={e => updateFormData({ password: e.target.value })}
                        className="h-12 rounded-xl font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-[#1A1A2E]">Thibitisha</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={e => updateFormData({ confirmPassword: e.target.value })}
                        className="h-12 rounded-xl font-bold" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                onClick={handleNext}
                disabled={loading}
                className="w-full h-[56px] bg-[#FF6B35] hover:bg-[#FF8C61] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#FF6B35]/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    {role === 'VENDOR' && step < 4 ? 'Endelea' : 'Tengeneza Akaunti'}
                    <ArrowRight size={20} />
                  </div>
                )}
              </Button>

              <p className="text-center text-sm font-bold text-[#6B7280]">
                Tayari una akaunti?{' '}
                <Link to="/login" className="text-[#FF6B35] hover:underline">
                  Ingia Hapa
                </Link>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
