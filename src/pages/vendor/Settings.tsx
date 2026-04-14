import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Settings, Store, Image as ImageIcon, CreditCard, Bell, Shield, Save, Loader2, Upload } from 'lucide-react';
import { useVendorProfile, useUpdateVendorProfile } from '@/hooks/useVendor';
import { toast } from 'sonner';

export default function VendorSettings() {
  const { data: profile, isLoading } = useVendorProfile();
  const updateMutation = useUpdateVendorProfile();
  
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    address: '',
    paymentDetails: '',
    isWholesaler: false,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || '',
        description: profile.description || '',
        phone: profile.phone || '',
        address: profile.address || '',
        paymentDetails: profile.paymentDetails || '',
        isWholesaler: profile.isWholesaler || false,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value.toString()));
    await updateMutation.mutateAsync(data);
  };

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Mipangilio ya Duka</h1>
            <p className="text-[#6B7280] font-bold">Dhibiti wasifu wa duka lako na malipo.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#FF6B35]/20 hover:bg-[#FF6B35]/90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Hifadhi Mabadiliko
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {[
              { id: 'general', name: 'Wasifu wa Duka', icon: Store },
              { id: 'branding', name: 'Logo & Picha', icon: ImageIcon },
              { id: 'payment', name: 'Malipo & Benki', icon: CreditCard },
              { id: 'notifications', name: 'Arifa', icon: Bell },
              { id: 'security', name: 'Usalama', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all uppercase tracking-tight ${
                  tab.id === 'general' ? 'bg-[#1A1A2E] text-white shadow-lg' : 'text-[#6B7280] hover:bg-white hover:shadow-sm'
                }`}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="md:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-4">Taarifa za Msingi</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Jina la Biashara</label>
                <input 
                  type="text" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full h-12 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 font-bold text-[#1A1A2E] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Maelezo ya Duka</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 py-3 font-bold text-[#1A1A2E] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Namba ya Simu</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 font-bold text-[#1A1A2E] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Anwani</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-12 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 font-bold text-[#1A1A2E] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <input 
                  type="checkbox" 
                  id="isWholesaler"
                  checked={formData.isWholesaler}
                  onChange={(e) => setFormData({ ...formData, isWholesaler: e.target.checked })}
                  className="w-5 h-5 accent-[#FF6B35]"
                />
                <label htmlFor="isWholesaler" className="text-sm font-black text-blue-800 uppercase tracking-tight cursor-pointer">
                  Hili ni Duka la Jumla (Wholesale Store)
                </label>
              </div>
            </div>

            {/* Branding */}
            <div className="bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-4">Logo & Branding</h3>
              
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-[32px] bg-[#F8F9FA] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all overflow-hidden relative group">
                  {profile?.businessLogo ? (
                    <img src={profile.businessLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-[#6B7280]" />
                      <span className="text-[10px] font-black text-[#6B7280] uppercase">Logo</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black text-white uppercase">Badilisha</span>
                  </div>
                  <input type="file" className="hidden" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-bold text-[#1A1A2E]">Logo ya Duka Lako</p>
                  <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                    Logo hii itaonekana kwenye wasifu wako na kwenye risiti za wateja. 
                    Inapendekezwa kutumia picha yenye ukubwa wa 512x512px.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-4">Taarifa za Malipo</h3>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Maelezo ya Malipo (Benki / Mobile Money)</label>
                <textarea 
                  value={formData.paymentDetails}
                  onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                  placeholder="mf. NMB Bank: 123456789 au M-Pesa: 0687225353"
                  className="w-full h-32 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 py-3 font-bold text-[#1A1A2E] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
