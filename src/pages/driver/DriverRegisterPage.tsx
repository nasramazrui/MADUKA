import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Car, 
  FileText, 
  Zap, 
  MapPin, 
  Clock, 
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Check,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const STEPS = [
  { id: 1, label: 'Taarifa za Msingi', icon: User, color: 'bg-[#FF6B35]' },
  { id: 2, label: 'Taarifa za Gari', icon: Car, color: 'bg-blue-500' },
  { id: 3, label: 'Nyaraka & Uhalali', icon: FileText, color: 'bg-green-500' },
  { id: 4, label: 'Chaguo la Huduma', icon: Zap, color: 'bg-purple-500' },
  { id: 5, label: 'Eneo la Kazi', icon: MapPin, color: 'bg-red-500' },
  { id: 6, label: 'Upatikanaji', icon: Clock, color: 'bg-amber-500' },
  { id: 7, label: 'Malipo & Masharti', icon: CreditCard, color: 'bg-emerald-500' },
];

const VEHICLE_MAKES = ['Toyota', 'Nissan', 'Honda', 'Subaru', 'Mercedes', 'BMW', 'Hyundai', 'Kia', 'Suzuki', 'Mitsubishi', 'Other'];
const VEHICLE_MODELS: Record<string, string[]> = {
  Toyota: ['Corolla', 'Harrier', 'Hilux', 'Land Cruiser', 'Vitz', 'RAV4', 'Ist', 'Noah', 'Alphard'],
  Nissan: ['X-Trail', 'Patrol', 'Tiida', 'Note', 'Navara', 'Dualis'],
  Honda: ['Fit', 'CR-V', 'Civic', 'Insight', 'Vezel'],
  Suzuki: ['Swift', 'Carry', 'Vitara', 'Jimny'],
  // ... more
};

export default function DriverRegisterPage() {
  const navigate = useNavigate();
  const { setUser, setFirebaseUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nidaNumber: '',
    password: '',
    confirmPassword: '',
    selfie: null as File | null,
    selfiePreview: '',

    // Step 2
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    vehicleYear: new Date().getFullYear(),
    vehicleColor: 'Nyeusi',
    vehicleSeats: 5,
    vehiclePhotos: [] as { file: File, preview: string, type: string }[],

    // Step 3
    licenseFile: null as File | null,
    licenseExpiry: '',
    insuranceFile: null as File | null,
    insuranceExpiry: '',
    insuranceCompany: '',
    regCardFile: null as File | null,
    tinCertFile: null as File | null,

    // Step 4
    offersTaxi: false,
    offersRental: false,

    // Step 5
    region: '',
    district: '',
    ward: '',
    workRadius: 10,
    lat: -6.7924,
    lng: 39.2083,
    address: '',

    // Step 6
    workType: 'FULL_TIME',
    availability: {} as Record<string, string[]>,

    // Step 7
    payoutMethod: 'MPESA',
    payoutPhone: '',
    payoutName: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    payoutPreference: 'WEEKLY',
    agreedTerms: false,
    agreedBackgroundCheck: false,
    infoIsCorrect: false,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.agreedTerms || !formData.infoIsCorrect) {
      toast.error('Tafadhali kubali masharti na uthibitishe taarifa zako');
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      setFirebaseUser(firebaseUser);

      // 2. Upload Files (Mock for now, in real app we'd upload to Storage)
      // const selfieUrl = await uploadFile(formData.selfie);
      // ...

      // 3. Sync with Backend
      const response = await api.post('/driver/register', {
        firebaseUid: firebaseUser.uid,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      setUser(response.data);
      toast.success('Usajili umekamilika! Subiri uhakiki wa admin.');
      setStep(8); // Success step

    } catch (error: any) {
      console.error('Driver registration error:', error);
      toast.error(error.message || 'Imeshindwa kukamilisha usajili');
    } finally {
      setLoading(false);
    }
  };

  // Map Setup
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Should be in env
  });

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      updateFormData({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  if (step === 8) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 text-green-600"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-black text-[#1A1A2E] mb-4">Maombi Yamewasilishwa Vizuri!</h1>
        <p className="text-[#6B7280] font-bold mb-2 uppercase tracking-widest">Namba ya Maombi: #DRV-2024-001</p>
        
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] w-full max-w-md my-8 space-y-6 text-left">
          <h3 className="font-black text-[#1A1A2E]">Hatua Zinazofuata:</h3>
          <div className="space-y-4">
            {[
              { label: 'Maombi yamepokelewa', status: 'done' },
              { label: 'Admin ataangalia (saa 24-48)', status: 'pending' },
              { label: 'Utapata SMS ukikubaliwa', status: 'pending' },
              { label: 'Anza kupata safari!', status: 'pending' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {item.status === 'done' ? <Check size={14} strokeWidth={4} /> : <Clock size={14} />}
                </div>
                <span className={`text-sm font-bold ${item.status === 'done' ? 'text-[#1A1A2E]' : 'text-[#6B7280]'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={() => navigate('/home')} className="h-14 bg-[#1A1A2E] text-white rounded-2xl font-black">Rudi Nyumbani</Button>
          <Button variant="outline" className="h-14 rounded-2xl font-black">Wasiliana Nasi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] px-4 py-4">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s.id ? `${s.color} text-white` : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.id ? <Check size={16} strokeWidth={3} /> : s.id}
                </div>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#FF6B35]" 
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
          <p className="text-center text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mt-3">
            Hatua ya {step}: {STEPS[step-1].label}
          </p>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* STEP 1: BASIC INFO */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto text-[#FF6B35]">
                    <User size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Tuambie Habari Zako</h2>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Jina la Kwanza *</Label>
                      <Input 
                        placeholder="Amour" 
                        value={formData.firstName}
                        onChange={e => updateFormData({ firstName: e.target.value })}
                        className="h-12 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Jina la Mwisho *</Label>
                      <Input 
                        placeholder="Rashid" 
                        value={formData.lastName}
                        onChange={e => updateFormData({ lastName: e.target.value })}
                        className="h-12 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Namba ya Simu *</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#6B7280] border-r pr-3">+255</span>
                      <Input 
                        placeholder="7XXXXXXXX" 
                        value={formData.phone}
                        onChange={e => updateFormData({ phone: e.target.value })}
                        className="h-12 pl-[85px] rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Barua Pepe *</Label>
                    <Input 
                      type="email"
                      placeholder="driver@swiftapp.com" 
                      value={formData.email}
                      onChange={e => updateFormData({ email: e.target.value })}
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Namba ya NIDA / Kitambulisho *</Label>
                    <Input 
                      placeholder="19900101-12345-00001" 
                      value={formData.nidaNumber}
                      onChange={e => updateFormData({ nidaNumber: e.target.value })}
                      className="h-12 rounded-xl font-bold"
                    />
                    <p className="text-[10px] font-bold text-[#6B7280] ml-1 uppercase">Mfano: 19900101-12345-00001</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Nenosiri *</Label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={e => updateFormData({ password: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Thibitisha *</Label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={formData.confirmPassword}
                          onChange={e => updateFormData({ confirmPassword: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="font-bold ml-1">Picha Yako (Selfie) *</Label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-full bg-[#F8F9FA] border-4 border-dashed border-[#E5E7EB] flex items-center justify-center relative overflow-hidden group">
                        {formData.selfiePreview ? (
                          <img src={formData.selfiePreview} className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={32} className="text-[#6B7280]" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateFormData({ 
                                selfie: file, 
                                selfiePreview: URL.createObjectURL(file) 
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1A1A2E]">Bonyeza kupiga picha au chagua</p>
                        <p className="text-[10px] text-[#6B7280] mt-1">Uso uonekane wazi, bila kofia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VEHICLE INFO */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <Car size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Habari za Gari Lako</h2>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Aina ya Gari (Make) *</Label>
                    <select 
                      value={formData.vehicleMake}
                      onChange={e => updateFormData({ vehicleMake: e.target.value, vehicleModel: '' })}
                      className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Chagua Aina...</option>
                      {VEHICLE_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Model *</Label>
                    <select 
                      value={formData.vehicleModel}
                      onChange={e => updateFormData({ vehicleModel: e.target.value })}
                      disabled={!formData.vehicleMake}
                      className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50"
                    >
                      <option value="">Chagua Model...</option>
                      {formData.vehicleMake && VEHICLE_MODELS[formData.vehicleMake]?.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                      <option value="Other">Nyingine</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Namba ya Usajili *</Label>
                      <Input 
                        placeholder="T 123 ABC" 
                        value={formData.vehiclePlate}
                        onChange={e => updateFormData({ vehiclePlate: e.target.value.toUpperCase() })}
                        className="h-12 rounded-xl font-bold uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Mwaka wa Gari *</Label>
                      <select 
                        value={formData.vehicleYear}
                        onChange={e => updateFormData({ vehicleYear: parseInt(e.target.value) })}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none"
                      >
                        {Array.from({ length: 37 }, (_, i) => 2026 - i).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold ml-1">Rangi ya Gari *</Label>
                    <div className="flex flex-wrap gap-3">
                      {['Nyeusi', 'Nyeupe', 'Nyekundu', 'Bluu', 'Njano', 'Kijani', 'Kijivu', 'Silver'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateFormData({ vehicleColor: color })}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            formData.vehicleColor === color 
                              ? 'bg-[#1A1A2E] text-white shadow-lg' 
                              : 'bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold ml-1">Idadi ya Viti *</Label>
                    <div className="flex gap-3">
                      {[4, 5, 6, 7, 8].map(seats => (
                        <button
                          key={seats}
                          onClick={() => updateFormData({ vehicleSeats: seats })}
                          className={`flex-1 h-12 rounded-xl font-black transition-all ${
                            formData.vehicleSeats === seats 
                              ? 'bg-[#FF6B35] text-white shadow-lg' 
                              : 'bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          {seats}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="font-bold ml-1">Picha za Gari (3 required) *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Mbele', 'Nyuma', 'Ndani'].map((type) => {
                        const photo = formData.vehiclePhotos.find(p => p.type === type);
                        return (
                          <div key={type} className="space-y-2">
                            <div className="aspect-square bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center relative overflow-hidden group">
                              {photo ? (
                                <>
                                  <img src={photo.preview} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => updateFormData({ vehiclePhotos: formData.vehiclePhotos.filter(p => p.type !== type) })}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Camera size={20} className="text-[#6B7280]" />
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        updateFormData({ 
                                          vehiclePhotos: [...formData.vehiclePhotos, { file, preview: URL.createObjectURL(file), type }] 
                                        });
                                      }
                                    }}
                                  />
                                </>
                              )}
                            </div>
                            <p className="text-[10px] font-black text-center text-[#6B7280] uppercase">{type}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENTS */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <FileText size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Nyaraka za Uhalali</h2>
                </div>

                <div className="space-y-6">
                  {/* License Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <FileText size={20} />
                      </div>
                      <h3 className="font-black text-[#1A1A2E]">Leseni ya Udereva *</h3>
                    </div>
                    <div className="h-40 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280] relative overflow-hidden group hover:border-green-500 transition-all">
                      {formData.licenseFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 size={32} className="text-green-500" />
                          <span className="text-xs font-bold text-green-600">Leseni Imepakiwa</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-xs font-bold">Pakia Mbele na Nyuma</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e => updateFormData({ licenseFile: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#6B7280]">Tarehe ya Kuisha (Expiry) *</Label>
                      <Input 
                        type="date" 
                        value={formData.licenseExpiry}
                        onChange={e => updateFormData({ licenseExpiry: e.target.value })}
                        className="h-12 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  {/* Insurance Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="font-black text-[#1A1A2E]">Insurance ya Gari *</h3>
                    </div>
                    <div className="h-40 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280] relative overflow-hidden group hover:border-blue-500 transition-all">
                      {formData.insuranceFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 size={32} className="text-blue-500" />
                          <span className="text-xs font-bold text-blue-600">Insurance Imepakiwa</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-xs font-bold">Pakia Cheti cha Insurance</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e => updateFormData({ insuranceFile: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#6B7280]">Inaisha Lini? *</Label>
                        <Input 
                          type="date" 
                          value={formData.insuranceExpiry}
                          onChange={e => updateFormData({ insuranceExpiry: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#6B7280]">Kampuni *</Label>
                        <Input 
                          placeholder="e.g. Heritage" 
                          value={formData.insuranceCompany}
                          onChange={e => updateFormData({ insuranceCompany: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reg Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <FileText size={20} />
                      </div>
                      <h3 className="font-black text-[#1A1A2E]">Kadi ya Usajili (Logbook) *</h3>
                    </div>
                    <div className="h-40 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 text-[#6B7280] relative overflow-hidden group hover:border-purple-500 transition-all">
                      {formData.regCardFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 size={32} className="text-purple-500" />
                          <span className="text-xs font-bold text-purple-600">Kadi Imepakiwa</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-xs font-bold">Pakia Kadi ya Usajili</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e => updateFormData({ regCardFile: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SERVICE SELECTION */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                    <Zap size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Chagua Huduma Unazotaka</h2>
                  <p className="text-sm font-bold text-[#6B7280]">Unaweza kuchagua zaidi ya moja</p>
                </div>

                <div className="grid gap-6">
                  {/* Taxi Option */}
                  <button
                    onClick={() => updateFormData({ offersTaxi: !formData.offersTaxi })}
                    className={`text-left p-8 rounded-[32px] border-4 transition-all relative group ${
                      formData.offersTaxi 
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5 shadow-xl shadow-[#FF6B35]/10' 
                        : 'border-white bg-white hover:border-[#FF6B35]/20 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        formData.offersTaxi ? 'bg-[#FF6B35] text-white' : 'bg-[#F8F9FA] text-[#6B7280]'
                      }`}>
                        🚕
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.offersTaxi ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'border-[#E5E7EB]'
                      }`}>
                        {formData.offersTaxi && <Check size={18} strokeWidth={4} />}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-[#1A1A2E] mb-2 uppercase tracking-wider">Taxi Booking</h3>
                    <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">
                      "Usafiri wa haraka kama Bolt/Uber. Pata abiria karibu nawe na ulipwe papo hapo."
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Pata abiria karibu', 'Malipo ya haraka', 'Rating system'].map(f => (
                        <span key={f} className="text-[10px] font-black bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#1A1A2E] uppercase">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-xs font-black text-[#6B7280] uppercase">Commission</span>
                      <span className="text-lg font-black text-[#FF6B35]">15%</span>
                    </div>
                  </button>

                  {/* Rental Option */}
                  <button
                    onClick={() => updateFormData({ offersRental: !formData.offersRental })}
                    className={`text-left p-8 rounded-[32px] border-4 transition-all relative group ${
                      formData.offersRental 
                        ? 'border-purple-500 bg-purple-50 shadow-xl shadow-purple-500/10' 
                        : 'border-white bg-white hover:border-purple-500/20 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        formData.offersRental ? 'bg-purple-500 text-white' : 'bg-[#F8F9FA] text-[#6B7280]'
                      }`}>
                        🚗
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.offersRental ? 'bg-purple-500 border-purple-500 text-white' : 'border-[#E5E7EB]'
                      }`}>
                        {formData.offersRental && <Check size={18} strokeWidth={4} />}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-[#1A1A2E] mb-2 uppercase tracking-wider">Car Rental</h3>
                    <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">
                      "Kukodisha gari kwa siku/wiki. Weka bei yako na chagua siku unapopatikana."
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Bei yako mwenyewe', 'Calendar ya kisasa', 'Siku unazotaka'].map(f => (
                        <span key={f} className="text-[10px] font-black bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#1A1A2E] uppercase">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-xs font-black text-[#6B7280] uppercase">Commission</span>
                      <span className="text-lg font-black text-purple-600">10%</span>
                    </div>
                  </button>
                </div>

                <div className="p-6 bg-amber-50 rounded-[24px] border border-amber-100 flex gap-4">
                  <HelpCircle className="text-amber-500 shrink-0" size={24} />
                  <p className="text-xs font-medium text-amber-900 leading-relaxed">
                    💡 Unaweza kubadilisha chaguo lako baadaye kwenye mipangilio ya akaunti yako.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: WORK AREA */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                    <MapPin size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Unataka Kufanya Kazi Wapi?</h2>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Mkoa (Region) *</Label>
                      <select 
                        value={formData.region}
                        onChange={e => updateFormData({ region: e.target.value, district: '' })}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none"
                      >
                        <option value="">Chagua Mkoa...</option>
                        {['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Zanzibar'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Wilaya (District) *</Label>
                      <select 
                        value={formData.district}
                        onChange={e => updateFormData({ district: e.target.value })}
                        disabled={!formData.region}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none disabled:bg-gray-50"
                      >
                        <option value="">Chagua Wilaya...</option>
                        {formData.region === 'Dar es Salaam' && ['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold ml-1">Weka Eneo Lako kwenye Ramani</Label>
                    <div className="h-64 bg-[#F8F9FA] rounded-[24px] border border-[#E5E7EB] overflow-hidden relative">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={{ lat: formData.lat, lng: formData.lng }}
                          zoom={13}
                          onClick={onMapClick}
                        >
                          <Marker position={{ lat: formData.lat, lng: formData.lng }} draggable onDragEnd={(e) => {
                            if (e.latLng) updateFormData({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                          }} />
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7280] font-bold">
                          Inapakia Ramani...
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          navigator.geolocation.getCurrentPosition((pos) => {
                            updateFormData({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                          });
                        }}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#FF6B35] hover:bg-[#F8F9FA]"
                      >
                        <MapPin size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold ml-1">Umbali wa Kazi (Taxi Radius)</Label>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 20, 50, 100].map(r => (
                        <button
                          key={r}
                          onClick={() => updateFormData({ workRadius: r })}
                          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                            formData.workRadius === r 
                              ? 'bg-[#FF6B35] text-white shadow-lg' 
                              : 'bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          {r === 100 ? 'Nchi Nzima' : `${r}km`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: AVAILABILITY */}
            {step === 6 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                    <Clock size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Saa za Kazi Zako</h2>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'FULL_TIME', label: 'Full Time', icon: Clock, desc: 'Saa zote inapatikana' },
                      { id: 'PART_TIME', label: 'Part Time', icon: Calendar, desc: 'Saa fulani tu' },
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => updateFormData({ workType: type.id })}
                        className={`p-6 rounded-[24px] border-4 transition-all text-center space-y-2 ${
                          formData.workType === type.id 
                            ? 'border-[#FF6B35] bg-[#FF6B35]/5' 
                            : 'border-white bg-[#F8F9FA] hover:border-[#FF6B35]/20'
                        }`}
                      >
                        <type.icon size={24} className={formData.workType === type.id ? 'text-[#FF6B35] mx-auto' : 'text-[#6B7280] mx-auto'} />
                        <p className="font-black text-[#1A1A2E] uppercase tracking-wider">{type.label}</p>
                        <p className="text-[10px] font-bold text-[#6B7280]">{type.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold ml-1 uppercase tracking-widest text-xs text-[#6B7280]">Ratiba ya Wiki</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="p-2 text-left text-[10px] font-black text-[#6B7280] uppercase">Siku</th>
                            <th className="p-2 text-center text-[10px] font-black text-[#6B7280] uppercase">Asubuhi</th>
                            <th className="p-2 text-center text-[10px] font-black text-[#6B7280] uppercase">Mchana</th>
                            <th className="p-2 text-center text-[10px] font-black text-[#6B7280] uppercase">Usiku</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi', 'Jumapili'].map(day => (
                            <tr key={day} className="border-t border-gray-50">
                              <td className="p-2 text-xs font-bold text-[#1A1A2E]">{day}</td>
                              {['6-12', '12-18', '18-00'].map(shift => {
                                const key = `${day}-${shift}`;
                                const isActive = formData.availability[day]?.includes(shift);
                                return (
                                  <td key={shift} className="p-2 text-center">
                                    <button
                                      onClick={() => {
                                        const current = formData.availability[day] || [];
                                        const updated = isActive 
                                          ? current.filter(s => s !== shift)
                                          : [...current, shift];
                                        updateFormData({ availability: { ...formData.availability, [day]: updated } });
                                      }}
                                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                        isActive ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'border-[#E5E7EB] hover:border-[#FF6B35]/30'
                                      }`}
                                    >
                                      {isActive && <Check size={14} strokeWidth={4} className="mx-auto" />}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: PAYMENTS & TERMS */}
            {step === 7 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CreditCard size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1A1A2E]">Akaunti ya Kupokea Malipo</h2>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-[#E5E7EB] space-y-8">
                  <div className="space-y-4">
                    <Label className="font-bold ml-1">Chagua Njia ya Malipo *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'MPESA', label: 'M-Pesa', color: 'bg-green-500' },
                        { id: 'TIGOPESA', label: 'Tigo Pesa', color: 'bg-blue-600' },
                        { id: 'AIRTELMONEY', label: 'Airtel Money', color: 'bg-red-600' },
                        { id: 'BANK', label: 'Benki', color: 'bg-[#1A1A2E]' },
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => updateFormData({ payoutMethod: method.id })}
                          className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                            formData.payoutMethod === method.id 
                              ? 'border-[#FF6B35] bg-[#FF6B35]/5' 
                              : 'border-white bg-[#F8F9FA]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${method.color}`} />
                          <span className="font-black text-xs uppercase tracking-wider">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.payoutMethod !== 'BANK' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Namba ya Simu ya Malipo *</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#6B7280] border-r pr-3">+255</span>
                          <Input 
                            placeholder="7XXXXXXXX" 
                            value={formData.payoutPhone}
                            onChange={e => updateFormData({ payoutPhone: e.target.value })}
                            className="h-12 pl-[85px] rounded-xl font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Jina la Mmiliki *</Label>
                        <Input 
                          placeholder="Jina kama lilivyo sajiliwa" 
                          value={formData.payoutName}
                          onChange={e => updateFormData({ payoutName: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                        <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle size={12} /> Lazima lilingane na jina lako la usajili
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Jina la Benki *</Label>
                        <select 
                          value={formData.bankName}
                          onChange={e => updateFormData({ bankName: e.target.value })}
                          className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 font-bold outline-none"
                        >
                          <option value="">Chagua Benki...</option>
                          {['CRDB', 'NMB', 'NBC', 'Stanbic', 'Absa', 'Equity'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Namba ya Akaunti *</Label>
                        <Input 
                          placeholder="01XXXXXXXXXXXX" 
                          value={formData.bankAccount}
                          onChange={e => updateFormData({ bankAccount: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Jina la Akaunti *</Label>
                        <Input 
                          placeholder="Jina kamili la akaunti" 
                          value={formData.bankAccountName}
                          onChange={e => updateFormData({ bankAccountName: e.target.value })}
                          className="h-12 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    <Label className="font-bold ml-1 uppercase tracking-widest text-xs text-[#6B7280]">Masharti na Vigezo</Label>
                    <div className="h-40 bg-[#F8F9FA] rounded-[24px] border border-[#E5E7EB] p-6 overflow-y-auto space-y-4 text-xs font-medium text-[#6B7280] leading-relaxed">
                      <p className="font-black text-[#1A1A2E]">Kwa kusajili katika SwiftApp kama dereva, unakubali:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Kutoa huduma bora kwa wateja wote kwa uaminifu.</li>
                        <li>Kudumisha usafi wa gari lako wakati wote wa kazi.</li>
                        <li>Kufuata sheria zote za usalama barabarani za Tanzania.</li>
                        <li>Commission ya SwiftApp itakatwa kiotomatiki kwenye kila safari.</li>
                        <li>SwiftApp ina haki ya kusitisha akaunti yako ukikiuka vigezo.</li>
                      </ol>
                    </div>
                    <div className="space-y-3">
                      {[
                        { id: 'agreedTerms', label: 'Nimesoma na kukubali Masharti na Vigezo' },
                        { id: 'agreedBackgroundCheck', label: 'Nakubali Background Check (Uhakiki wa historia)' },
                        { id: 'infoIsCorrect', label: 'Nathibitisha kuwa taarifa zangu ni za kweli' },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => updateFormData({ [item.id]: !formData[item.id as keyof typeof formData] })}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            formData[item.id as keyof typeof formData] ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'border-[#E5E7EB] group-hover:border-[#FF6B35]/30'
                          }`}>
                            {formData[item.id as keyof typeof formData] && <Check size={12} strokeWidth={4} />}
                          </div>
                          <span className="text-xs font-bold text-[#1A1A2E]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="h-14 px-8 rounded-2xl font-black text-[#1A1A2E] border-[#E5E7EB]"
                >
                  <ArrowLeft size={20} className="mr-2" /> Rudi
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={loading}
                className={`flex-1 h-14 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] ${
                  step === 7 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-[#FF6B35] hover:bg-[#FF8C61] shadow-[#FF6B35]/20'
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    {step === 7 ? 'Wasilisha Maombi' : 'Endelea'}
                    <ArrowRight size={20} />
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
