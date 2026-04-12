import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Bike, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashibodi', path: '/admin' },
    { icon: Users, label: 'Wateja', path: '/admin/customers' },
    { icon: Store, label: 'Wauzaji', path: '/admin/vendors' },
    { icon: Bike, label: 'Madereva', path: '/admin/drivers' },
    { icon: ShoppingBag, label: 'Oda', path: '/admin/orders' },
    { icon: BarChart3, label: 'Ripoti', path: '/admin/reports' },
    { icon: CreditCard, label: 'Malipo', path: '/admin/payouts' },
    { icon: Settings, label: 'Mipangilio', path: '/admin/settings' },
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
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-[#E5E7EB] sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#1A1A2E] rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
              <span className="text-white text-2xl font-black italic">S</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#1A1A2E]">SwiftApp</h1>
              <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-[0.2em]">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                  location.pathname === item.path 
                    ? 'bg-[#1A1A2E] text-white shadow-lg shadow-black/10' 
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]'
                }`}
              >
                <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-[#6B7280] group-hover:text-[#1A1A2E]'} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F9FA] mb-4">
            <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-[#1A1A2E] truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Toka
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-[#F8F9FA] rounded-xl">
            <Menu size={24} />
          </button>
          <h1 className="font-black text-lg tracking-tight text-[#1A1A2E]">SwiftApp <span className="text-[#FF6B35]">Admin</span></h1>
        </div>
        <button className="p-2 hover:bg-[#F8F9FA] rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
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
              className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A1A2E] rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl font-black italic">S</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-[#1A1A2E]">SwiftApp</h1>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-[#F8F9FA] rounded-xl">
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        location.pathname === item.path 
                          ? 'bg-[#1A1A2E] text-white shadow-lg shadow-black/10' 
                          : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]'
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto p-6 border-t border-[#E5E7EB]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
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
        <div className="lg:hidden h-[52px]" /> {/* Spacer for mobile header */}
        <div className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
