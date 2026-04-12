import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Wallet, 
  Gift, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Share2,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      signOut();
      navigate('/login');
      toast.success('Umetoka kwenye akaunti');
    } catch (error) {
      toast.error('Imeshindwa kutoka kwenye akaunti');
    }
  };

  const menuItems = [
    { 
      group: 'Akaunti',
      items: [
        { id: 'edit', label: 'Taarifa Binafsi', icon: User, path: '/profile/edit' },
        { id: 'addresses', label: 'Anwani Zangu', icon: MapPin, path: '/profile/addresses' },
        { id: 'wallet', label: 'Wallet & Malipo', icon: Wallet, path: '/profile/wallet', badge: 'TZS 5,000' },
        { id: 'notifications', label: 'Arifa', icon: Bell, path: '/profile/notifications' },
      ]
    },
    {
      group: 'Mengineyo',
      items: [
        { id: 'referral', label: 'Mwaliko (Referral)', icon: Share2, path: '/profile/referral' },
        { id: 'points', label: 'Swift Points', icon: Star, path: '/profile/points', badge: '450 pts' },
        { id: 'security', label: 'Usalama', icon: Shield, path: '/profile/security' },
      ]
    },
    {
      group: 'Msaada',
      items: [
        { id: 'help', label: 'Msaada & Mawasiliano', icon: HelpCircle, path: '/help' },
        { id: 'about', label: 'Kuhusu SwiftApp', icon: Info, path: '/about' },
      ]
    }
  ];

  return (
    <CustomerLayout title="Mimi">
      <div className="px-4 py-6 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-[28px] bg-[#FF6B35] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#FF6B35]/20">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#1A1A2E] shadow-sm">
              <Settings size={16} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-[#1A1A2E]">{user?.name || 'Mteja wa SwiftApp'}</h2>
            <p className="text-sm font-bold text-[#6B7280]">{user?.phone || 'Hujasajili namba'}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full border border-[#FF6B35]/20">
              <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">{user?.role || 'CUSTOMER'}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Maagizo', value: '24', icon: Gift, color: 'text-blue-500' },
            { label: 'Points', value: '450', icon: Star, color: 'text-yellow-500' },
            { label: 'Wallet', value: '5k', icon: Wallet, color: 'text-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-[24px] border border-[#E5E7EB] text-center space-y-1 shadow-sm">
              <stat.icon size={20} className={`mx-auto ${stat.color}`} />
              <p className="text-lg font-black text-[#1A1A2E]">{stat.value}</p>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu Groups */}
        <div className="space-y-8">
          {menuItems.map((group) => (
            <div key={group.group} className="space-y-3">
              <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-2">{group.group}</h3>
              <div className="bg-white rounded-[32px] border border-[#E5E7EB] overflow-hidden shadow-sm">
                {group.items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between p-5 hover:bg-[#F8F9FA] transition-colors ${
                      idx !== group.items.length - 1 ? 'border-b border-[#F8F9FA]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#1A1A2E]">
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-[#1A1A2E]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] font-black text-[#FF6B35] bg-[#FF6B35]/5 px-2 py-1 rounded-lg border border-[#FF6B35]/10">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-[#6B7280]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 rounded-[24px] border border-red-100 font-black hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span>Ondoka kwenye Akaunti</span>
        </button>

        {/* Footer Info */}
        <div className="text-center space-y-1 pb-4">
          <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.3em]">SwiftApp v2.0.1</p>
          <p className="text-[10px] font-bold text-[#E5E7EB]">Made with ❤️ in Tanzania</p>
        </div>
      </div>
    </CustomerLayout>
  );
}
