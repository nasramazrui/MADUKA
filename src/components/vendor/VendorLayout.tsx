import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Wallet, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User,
  Menu,
  X,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/vendor' },
  { name: 'Usimamizi wa Bidhaa', icon: Package, path: '/vendor/products' },
  { name: 'Usimamizi wa Oda', icon: ShoppingBag, path: '/vendor/orders' },
  { name: 'Usimamizi wa Wateja', icon: Users, path: '/vendor/customers' },
  { name: 'Ripoti za Mauzo', icon: BarChart3, path: '/vendor/reports' },
  { name: 'Mapitio ya Wateja', icon: Bell, path: '/vendor/reviews' },
  { name: 'Mipangilio ya Duka', icon: Settings, path: '/vendor/settings' },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#1A1A2E] text-white flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center">
            <ShoppingBag size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic">SwiftVendor</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/vendor'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                ${isActive ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-primary/20">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Vendor'}&background=random`} alt="Avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name || 'Vendor Name'}</p>
              <p className="text-[10px] text-gray-500 truncate">Premium Partner</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
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
              className="fixed inset-y-0 left-0 w-64 bg-secondary text-white z-[101] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter italic">SwiftVendor</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/vendor'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/10">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b px-4 lg:px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-secondary hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-48 sm:w-64 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-10 lg:h-11 bg-gray-50 border border-border rounded-xl pl-10 lg:pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-secondary relative hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <button className="hidden sm:flex w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gray-50 border border-border items-center justify-center text-secondary hover:bg-gray-100 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
