import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  Package, 
  User,
  Bell
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface CustomerLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function CustomerLayout({ children, title, showBack }: CustomerLayoutProps) {
  const location = useLocation();
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const navItems = [
    { path: '/home', label: 'Nyumbani', icon: Home },
    { path: '/search', label: 'Tafuta', icon: Search },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { path: '/orders', label: 'Maagizo', icon: Package },
    { path: '/profile', label: 'Mimi', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Header */}
      <header className="bg-white sticky top-0 z-40 px-4 h-16 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => window.history.back()} className="p-2 -ml-2 hover:bg-[#F8F9FA] rounded-full">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Package size={24} className="rotate-180" />
              </motion.div>
            </button>
          )}
          <h1 className="text-lg font-black text-[#1A1A2E] tracking-tight">
            {title || 'SwiftApp ⚡'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 relative hover:bg-[#F8F9FA] rounded-full text-[#1A1A2E]">
            <Bell size={24} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full border-2 border-white" />
          </button>
          <NavLink to="/cart" className="p-2 relative hover:bg-[#F8F9FA] rounded-full text-[#1A1A2E]">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-2 py-3 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
                isActive ? 'text-[#FF6B35]' : 'text-[#6B7280]'
              }`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-3 w-8 h-1 bg-[#FF6B35] rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
