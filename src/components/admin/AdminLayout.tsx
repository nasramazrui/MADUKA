import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  CheckSquare, 
  QrCode, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { name: 'Verification Queue', icon: CheckSquare, path: '/admin/verification' },
  { name: 'Vendors', icon: Store, path: '/admin/vendors' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Lipa Namba', icon: CreditCard, path: '/admin/lipanamba' },
  { name: 'QR Management', icon: QrCode, path: '/admin/qr' },
  { name: 'Platform Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#1A1A2E] text-white flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter italic block leading-none">SwiftApp</span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Control Center</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={22} />
              <span className="font-bold text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-6">
          <div className="bg-white/5 rounded-3xl p-5 flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">System Status</p>
              <p className="text-sm font-black text-success">Healthy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 overflow-hidden border-2 border-primary/20">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`} alt="Avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-primary font-bold uppercase">Super Admin</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#1A1A2E] text-white z-[101] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter italic">SwiftAdmin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                      ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <item.icon size={22} />
                    <span className="font-bold text-sm">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-6 border-t border-white/5">
                <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut size={22} />
                  <span className="font-bold">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 lg:h-24 bg-white border-b border-gray-200 px-4 lg:px-10 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#1A1A2E] hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-black text-[#1A1A2E] hidden sm:block">Platform Overview</h2>
            <div className="h-8 w-px bg-gray-200 hidden lg:block" />
            <div className="relative w-48 sm:w-64 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-10 lg:h-12 bg-gray-50 border border-gray-200 rounded-xl lg:rounded-2xl pl-10 lg:pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-xs lg:text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden md:flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 lg:border-4 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-[#1A1A2E] relative hover:bg-gray-100 transition-all">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 lg:top-3.5 lg:right-3.5 w-2 lg:w-2.5 h-2 lg:h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
