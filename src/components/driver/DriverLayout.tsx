import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MapPin, 
  History, 
  Wallet, 
  Star, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Zap,
  Car,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DriverLayoutProps {
  children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashibodi', path: '/driver' },
    { icon: Zap, label: 'Safari za Taxi', path: '/driver/taxi', show: user?.driver?.offersTaxi },
    { icon: Car, label: 'Rental Listings', path: '/driver/rental', show: user?.driver?.offersRental },
    { icon: MapPin, label: 'Ramani ya Live', path: '/driver/map' },
    { icon: Wallet, label: 'Mapato', path: '/driver/earnings' },
    { icon: Star, label: 'Maoni', path: '/driver/reviews' },
    { icon: User, label: 'Wasifu Wangu', path: '/driver/profile' },
    { icon: Settings, label: 'Mipangilio', path: '/driver/settings' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      signOut();
      navigate('/login');
      toast.success('Umetoka kwenye akaunti');
    } catch (error) {
      toast.error('Imeshindwa kutoka');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#1A1A2E] text-white sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
              <span className="text-white text-2xl font-black italic">S</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">SwiftApp</h1>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Panel ya Dereva</span>
            </div>
          </div>

          {/* Online Toggle */}
          <div className={`p-4 rounded-2xl border-2 transition-all mb-8 ${
            isOnline ? 'bg-green-500/10 border-green-500/50' : 'bg-gray-500/10 border-gray-500/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                {isOnline ? '🟢 Online' : '⚫ Offline'}
              </span>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-10 h-5 rounded-full relative transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <motion.div 
                  animate={{ x: isOnline ? 22 : 2 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            <p className="text-[10px] font-medium text-gray-400">
              {isOnline ? 'Unapokea safari na booking' : 'Hupokei safari kwa sasa'}
            </p>
          </div>

          <nav className="space-y-1">
            {menuItems.filter(item => item.show !== false).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                  location.pathname === item.path 
                    ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">{user?.driver?.vehiclePlate}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
              <Star size={10} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black text-amber-500">{user?.driver?.avgRating || '5.0'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            Toka
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A1A2E] text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-xl">
            <Menu size={24} />
          </button>
          <h1 className="font-black text-lg tracking-tight">SwiftApp <span className="text-purple-400">Dereva</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
              isOnline ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A1A2E]" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#1A1A2E] text-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl font-black italic">S</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight">SwiftApp</h1>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.filter(item => item.show !== false).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        location.pathname === item.path 
                          ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto p-6 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{user?.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{user?.driver?.vehiclePlate}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} />
                  Toka
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden h-[60px]" /> {/* Spacer for mobile header */}
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
