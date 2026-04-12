import React, { useState, useEffect } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { useVendorProfile, useUpdateVendorProfile } from '@/hooks/useVendor';
import { Loader2, Upload, Store, MapPin, Phone, Mail, Clock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function VendorProfile() {
  const { data: profile, isLoading } = useVendorProfile();
  const updateMutation = useUpdateVendorProfile();

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    address: '',
    tinNumber: '',
    deliveryRadiusKm: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || '',
        description: profile.description || '',
        address: profile.address || '',
        tinNumber: profile.tinNumber || '',
        deliveryRadiusKm: profile.deliveryRadiusKm?.toString() || '5',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (logo) data.append('logo', logo);
    if (cover) data.append('cover', cover);

    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <VendorLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="mt-4 text-text-secondary font-bold">Loading profile...</p>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Business Profile</h1>
          <p className="text-text-secondary font-medium">Manage your business information and branding.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Branding Section */}
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-100 relative">
              {(cover || profile?.coverUrl) && (
                <img 
                  src={cover ? URL.createObjectURL(cover) : profile.coverUrl} 
                  className="w-full h-full object-cover" 
                  alt="Cover" 
                />
              )}
              <label className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <Upload size={16} /> Change Cover
                </div>
                <input type="file" className="hidden" onChange={(e) => e.target.files && setCover(e.target.files[0])} />
              </label>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="absolute -top-12 left-8">
                <div className="w-24 h-24 bg-white rounded-3xl border-4 border-white shadow-xl overflow-hidden relative group">
                  {(logo || profile?.logoUrl) ? (
                    <img 
                      src={logo ? URL.createObjectURL(logo) : profile.logoUrl} 
                      className="w-full h-full object-cover" 
                      alt="Logo" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <Store size={32} />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={20} className="text-white" />
                    <input type="file" className="hidden" onChange={(e) => e.target.files && setLogo(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Business Name</label>
                  <input 
                    type="text" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">TIN Number</label>
                  <input 
                    type="text" 
                    value={formData.tinNumber}
                    onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                    className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm space-y-6">
            <h3 className="text-xl font-black text-secondary flex items-center gap-2">
              <MapPin size={24} className="text-primary" /> Location & Delivery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Delivery Radius (km)</label>
                <input 
                  type="number" 
                  value={formData.deliveryRadiusKm}
                  onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: e.target.value })}
                  className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary">Business Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-32 bg-gray-50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button"
              className="px-8 py-4 bg-gray-100 text-secondary rounded-2xl font-black hover:bg-gray-200 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {updateMutation.isPending && <Loader2 className="animate-spin" size={20} />}
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
