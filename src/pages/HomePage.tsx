import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  Utensils, 
  ShoppingCart, 
  ShoppingBag, 
  Pill, 
  Package, 
  Car, 
  Key, 
  Hotel,
  Zap,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const services = [
  { id: 'food', name: 'Chakula', icon: Utensils, color: 'bg-[#FF6B35]', path: '/search?category=FOOD' },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart, color: 'bg-[#0F9B58]', path: '/search?category=GROCERY' },
  { id: 'ecommerce', name: 'Maduka', icon: ShoppingBag, color: 'bg-[#3B82F6]', path: '/search?category=SHOP' },
  { id: 'pharmacy', name: 'Dawa', icon: Pill, color: 'bg-[#EF4444]', path: '/search?category=PHARMACY' },
  { id: 'parcel', name: 'Vifurushi', icon: Package, color: 'bg-[#8B5CF6]', path: '/parcel' },
  { id: 'taxi', name: 'Teksi', icon: Car, color: 'bg-[#F59E0B]', path: '/taxi' },
  { id: 'rental', name: 'Kodisha', icon: Key, color: 'bg-[#6366F1]', path: '/rental' },
  { id: 'hotel', name: 'Hoteli', icon: Hotel, color: 'bg-[#EC4899]', path: '/hotel' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data fetching
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => [
      { id: 1, image: 'https://picsum.photos/seed/banner1/800/400', title: 'Punguzo la 50%', subtitle: 'Kwenye oda yako ya kwanza' },
      { id: 2, image: 'https://picsum.photos/seed/banner2/800/400', title: 'Free Delivery', subtitle: 'Kwa manunuzi ya TZS 20,000+' },
    ]
  });

  const { data: nearbyVendors } = useQuery({
    queryKey: ['nearby-vendors'],
    queryFn: async () => [
      { id: '1', businessName: 'Karibu Restaurant', businessType: 'RESTAURANT', avgRating: 4.8, distance: '1.2 km', logoUrl: 'https://picsum.photos/seed/vendor1/100' },
      { id: '2', businessName: 'City Grocery', businessType: 'GROCERY', avgRating: 4.5, distance: '0.8 km', logoUrl: 'https://picsum.photos/seed/vendor2/100' },
      { id: '3', businessName: 'Amana Pharmacy', businessType: 'PHARMACY', avgRating: 4.9, distance: '2.5 km', logoUrl: 'https://picsum.photos/seed/vendor3/100' },
    ]
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <CustomerLayout>
      <div className="px-4 py-6 space-y-8">
        {/* Header & Location */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#6B7280]">Habari, {user?.name?.split(' ')[0] || 'Mteja'} 👋</p>
            <button className="flex items-center gap-1 text-[#1A1A2E] font-black group">
              <MapPin size={18} className="text-[#FF6B35]" />
              <span className="text-sm truncate max-w-[180px]">{user?.address || 'Dar es Salaam, TZ'}</span>
              <ChevronRight size={16} className="text-[#6B7280] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#1A1A2E] shadow-sm">
            <Search size={24} />
          </div>
        </div>

        {/* Promo Banners */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar snap-x">
          {banners?.map((banner) => (
            <div 
              key={banner.id}
              className="min-w-[300px] h-[160px] bg-[#1A1A2E] rounded-[24px] relative overflow-hidden snap-center"
            >
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                <h3 className="text-xl font-black leading-tight">{banner.title}</h3>
                <p className="text-sm font-bold text-white/80 mt-1">{banner.subtitle}</p>
                <button className="mt-4 w-fit px-4 py-2 bg-[#FF6B35] rounded-xl text-xs font-black uppercase tracking-wider">
                  Agiza Sasa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-4">
          {services.map((service) => (
            <button 
              key={service.id}
              onClick={() => navigate(service.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 ${service.color} rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-black/5 group-active:scale-90 transition-transform`}>
                <service.icon size={28} />
              </div>
              <span className="text-[11px] font-black text-[#1A1A2E] uppercase tracking-wider">{service.name}</span>
            </button>
          ))}
        </div>

        {/* Flash Sales */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-[#FF6B35] fill-[#FF6B35]" />
              <h2 className="text-lg font-black text-[#1A1A2E]">Ofa Maalum</h2>
            </div>
            <button className="text-sm font-bold text-[#FF6B35]">Ona Zote</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[160px] bg-white rounded-[24px] p-3 border border-[#E5E7EB] snap-center shadow-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <img src={`https://picsum.photos/seed/food${i}/200`} alt="Food" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 left-2 bg-[#EF4444] text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    -20%
                  </div>
                </div>
                <h4 className="text-sm font-black text-[#1A1A2E] truncate">Kuku wa Kuchoma</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#FF6B35] font-black text-sm">TZS 12k</span>
                  <span className="text-[#6B7280] text-[10px] line-through">15k</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Vendors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A1A2E]">Karibu Nawe</h2>
            <button className="text-sm font-bold text-[#FF6B35]">Ona Zote</button>
          </div>
          <div className="space-y-4">
            {nearbyVendors?.map((vendor) => (
              <button 
                key={vendor.id}
                onClick={() => navigate(`/vendor/${vendor.id}`)}
                className="w-full bg-white p-4 rounded-[24px] border border-[#E5E7EB] flex gap-4 hover:border-[#FF6B35]/30 transition-all shadow-sm group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 text-left">
                  <div>
                    <h3 className="font-black text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">{vendor.businessName}</h3>
                    <p className="text-xs font-bold text-[#6B7280] mt-0.5">{vendor.businessType}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-xs font-black text-[#1A1A2E]">{vendor.avgRating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-[#6B7280]" />
                      <span className="text-xs font-bold text-[#6B7280]">{vendor.distance}</span>
                    </div>
                  </div>
                </div>
                <div className="self-center">
                  <div className="w-8 h-8 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#6B7280] group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
