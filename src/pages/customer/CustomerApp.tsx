import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShoppingBag, Truck, MapPin, Search, Bell, User, Utensils, ShoppingCart, Pill, Package, Car, Key, Hotel, Heart, History, Wallet, Star, Clock, Plus, Share2, ChevronLeft, Minus, CheckCircle2, Phone, CreditCard, QrCode, ShieldCheck, Loader2, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useVendors, useCreateOrder, useProducts, useCustomerOrders } from '@/hooks/useCustomer';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

// --- SPLASH SCREEN ---
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full w-full bg-[#1A1A2E] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="w-28 h-28 bg-gradient-to-br from-primary to-orange-400 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(255,107,53,0.3)] mb-8 relative">
          <Zap size={56} className="text-white fill-white" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-[2.5rem] -z-10"
          />
        </div>
        <h1 className="text-5xl font-black tracking-tighter italic">SwiftApp</h1>
        <p className="mt-4 text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">Kila Kitu, Mahali Pamoja</p>
      </motion.div>
      
      <div className="absolute bottom-20 flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

// --- ONBOARDING ---
const onboardingSlides = [
  {
    image: "https://picsum.photos/seed/delivery/800/800",
    title: "Chakula Chochote, Popote",
    subtitle: "Agiza kutoka mikahawa bora karibu nawe na ufikishiwe kwa haraka zaidi.",
    color: "from-orange-50 to-white"
  },
  {
    image: "https://picsum.photos/seed/shopping/800/800",
    title: "Nunua Bidhaa Kwa Urahisi",
    subtitle: "Maduka mengi, bei nzuri, na delivery mpaka mlangoni pako.",
    color: "from-blue-50 to-white"
  },
  {
    image: "https://picsum.photos/seed/services/800/800",
    title: "Huduma Zote Mahali Pamoja",
    subtitle: "Gari, hoteli, dawa, vifurushi — yote ndani ya SwiftApp moja.",
    color: "from-purple-50 to-white"
  }
];

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className={`h-full w-full flex flex-col bg-gradient-to-b transition-all duration-700 ${onboardingSlides[current].color}`}>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <div className="w-72 h-72 mx-auto rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-[6px] border-white relative">
              <img 
                src={onboardingSlides[current].image} 
                alt="Onboarding" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-secondary tracking-tight leading-tight">{onboardingSlides[current].title}</h2>
              <p className="text-text-secondary font-bold px-6 leading-relaxed">{onboardingSlides[current].subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-10 space-y-10 pb-16">
        <div className="flex justify-center gap-3">
          {onboardingSlides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-primary' : 'w-2 bg-gray-200'}`} 
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={onFinish}
            className="text-text-secondary font-black uppercase tracking-widest text-xs hover:text-secondary transition-colors"
          >
            Skip
          </button>
          <Button 
            onClick={() => current < onboardingSlides.length - 1 ? setCurrent(current + 1) : onFinish()}
            className="h-16 w-16 rounded-[2rem] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 flex items-center justify-center group"
          >
            <ArrowRight size={28} className="text-white group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- HOME SCREEN ---
const modules = [
  { id: 'food', name: 'Chakula', icon: Utensils, color: 'bg-orange-500' },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart, color: 'bg-green-500' },
  { id: 'pharmacy', name: 'Dawa', icon: Pill, color: 'bg-red-500' },
  { id: 'parcel', name: 'Mzigo', icon: Package, color: 'bg-purple-500' },
  { id: 'taxi', name: 'Teksi', icon: Car, color: 'bg-yellow-500' },
  { id: 'rental', name: 'Gari', icon: Key, color: 'bg-indigo-500' },
  { id: 'hotel', name: 'Hoteli', icon: Hotel, color: 'bg-pink-500' },
  { id: 'shops', name: 'Maduka', icon: ShoppingBag, color: 'bg-blue-500' },
];

export function HomeScreen({ onNavigate }: { onNavigate: (screen: any, data?: any) => void }) {
  const { user } = useAuth();
  const { data: vendors, isLoading } = useVendors();

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b space-y-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-secondary leading-tight">Habari, {user?.name?.split(' ')[0] || 'Mteja'}! 👋</h3>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Unataka nini leo?</p>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-2xl bg-gray-50 border border-border flex items-center justify-center relative hover:bg-gray-100 transition-colors">
              <Bell size={22} className="text-secondary" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-gray-50 border border-border flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors"
            >
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
        
        <button className="flex items-center gap-2 text-sm font-bold text-secondary bg-gray-50 px-4 py-2 rounded-xl border border-border self-start">
          <MapPin size={16} className="text-primary" />
          Kinondoni, Dar es Salaam
          <ChevronLeft size={14} className="-rotate-90" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32 scrollbar-hide">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Tafuta chakula, bidhaa, huduma..." 
            className="w-full h-16 bg-white border-2 border-border rounded-2xl pl-14 pr-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all font-medium"
          />
        </div>

        {/* Banners */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4">
          <div className="min-w-[320px] h-44 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-[2rem] p-8 text-white flex flex-col justify-between snap-center shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-black text-2xl leading-tight">Delivery FREE <br />kila siku!</h4>
              <p className="text-sm font-bold opacity-80 mt-1">Kwa maagizo ya kwanza 3</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md self-start px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10">
              Inaisha kwa: 02:45:30
            </div>
            <Zap size={120} className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12" />
          </div>
          <div className="min-w-[320px] h-44 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-[2rem] p-8 text-white flex flex-col justify-between snap-center shadow-xl shadow-secondary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-black text-2xl leading-tight">Dawa za <br />Pharmacy</h4>
              <p className="text-sm font-bold opacity-80 mt-1">20% punguzo kwa kila oda</p>
            </div>
            <button className="bg-primary text-white self-start px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 shadow-lg shadow-primary/20">
              Agiza Sasa
            </button>
            <Pill size={120} className="absolute right-[-20px] bottom-[-20px] text-white/5 -rotate-12" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Huduma Zetu</h4>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {modules.map((m) => (
              <button 
                key={m.id} 
                onClick={() => toast.info(`${m.name} feature coming soon!`)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-16 h-16 ${m.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                  <m.icon size={28} />
                </div>
                <span className="text-[11px] font-black text-secondary group-hover:text-primary transition-colors">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Restaurants */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Karibu Nawe</h4>
            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Ona Zote</button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="min-w-[240px] h-64 bg-gray-100 animate-pulse rounded-[2rem]" />
              ))
            ) : vendors?.length > 0 ? (
              vendors.map((v: any) => (
                <div 
                  key={v.id} 
                  onClick={() => onNavigate('detail', v)}
                  className="min-w-[240px] bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={v.coverUrl || `https://picsum.photos/seed/${v.id}/600/400`} 
                      alt={v.businessName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-secondary shadow-sm">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" /> {v.avgRating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h5 className="font-black text-secondary text-base truncate group-hover:text-primary transition-colors">{v.businessName}</h5>
                      <p className="text-[11px] font-bold text-text-secondary mt-0.5">{v.businessType} • {v.address}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-black text-text-secondary bg-gray-50 px-2 py-1 rounded-lg">
                          <Clock size={12} /> 25 min
                        </span>
                        <span className="text-[10px] font-black text-success bg-green-50 px-2 py-1 rounded-lg">Free delivery</span>
                      </div>
                      <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-90">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-10 text-center">
                <p className="text-text-secondary font-bold">No vendors found nearby.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Nav - FIXED TO CONTAINER */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border px-8 py-4 flex justify-between items-center z-40 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1.5 text-primary group">
          <div className="relative">
            <HomeScreenIcon active />
            <motion.div layoutId="activeTab" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Nyumbani</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-secondary transition-colors">
          <Search size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">Tafuta</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-secondary transition-colors relative" onClick={() => onNavigate('cart')}>
          <div className="relative">
            <ShoppingBag size={22} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-white">2</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Mkoba</span>
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-secondary transition-colors"
        >
          <User size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">Mimi</span>
        </button>
      </div>
    </div>
  );
}

function HomeScreenIcon({ active }: { active?: boolean }) {
  return (
    <div className={`w-6 h-6 flex items-center justify-center ${active ? 'text-primary' : 'text-text-secondary'}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  );
}

// --- PRODUCT DETAIL ---
function ProductDetail({ vendor, onBack }: { vendor: any, onBack: () => void }) {
  if (!vendor) return null;
  const { data: products, isLoading } = useProducts(vendor.id);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      vendorType: vendor.businessType
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="h-full bg-white flex flex-col relative">
      <div className="relative h-[300px]">
        <img 
          src={vendor.coverUrl || `https://picsum.photos/seed/${vendor.id}/1200/800`} 
          alt={vendor.businessName} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <div className="absolute top-14 left-6 right-6 flex justify-between items-center">
          <button onClick={onBack} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <ChevronLeft size={28} className="text-secondary" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white -mt-12 rounded-t-[3rem] p-8 space-y-8 overflow-y-auto scrollbar-hide relative z-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-secondary leading-tight">{vendor.businessName}</h2>
          <p className="text-sm font-bold text-text-secondary">{vendor.address}</p>
        </div>

        <div className="space-y-6">
          <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Menu</h4>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : products?.length > 0 ? (
            products.map((product: any) => (
              <div key={product.id} className="flex gap-4 p-4 bg-gray-50 rounded-[2rem] border border-border">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border">
                  <img src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/400`} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-secondary text-sm">{product.name}</h5>
                    <p className="text-[10px] text-text-secondary line-clamp-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-primary text-sm">TZS {product.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-text-secondary font-bold">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- CART SCREEN ---
function CartScreen({ onBack, onCheckout }: { onBack: () => void, onCheckout: () => void }) {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="h-full bg-[#F8F9FA] flex flex-col pt-12">
      <div className="p-6 bg-white border-b flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-secondary" />
        </button>
        <h2 className="text-xl font-black text-secondary">Mkoba Wako ({items.length})</h2>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
        {items.length > 0 ? (
          <div className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-dashed border-border pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
                  <Utensils size={24} />
                </div>
                <div>
                  <h4 className="font-black text-secondary">{items[0].vendorName}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border">
                    <img src={item.image || `https://picsum.photos/seed/${item.productId}/400/400`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-black text-secondary text-base">{item.name}</h5>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-danger p-1 hover:bg-red-50 rounded-lg transition-colors">
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-primary">TZS {(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-border">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-text-secondary shadow-sm active:scale-90 transition-transform"><Minus size={16} /></button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40">
            <ShoppingBag size={64} />
            <p className="font-black uppercase tracking-widest text-xs">Mkoba wako upo wazi</p>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="space-y-4">
              <h4 className="font-black text-secondary uppercase tracking-widest text-xs px-2">Maelekezo Maalum</h4>
              <textarea 
                placeholder="Mfano: Usiweke pilipili nyingi..."
                className="w-full p-6 bg-white border-2 border-border rounded-[2rem] h-32 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-border space-y-5 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary font-bold">Jumla ya bidhaa</span>
                <span className="font-black text-secondary">TZS {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary font-bold">Ada ya delivery</span>
                <span className="font-black text-secondary">Bure</span>
              </div>
              <div className="pt-5 border-t border-dashed border-border flex justify-between items-center">
                <span className="font-black text-secondary uppercase tracking-widest text-xs">JUMLA KUU</span>
                <span className="text-3xl font-black text-primary">TZS {total.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-8 bg-white border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Button onClick={onCheckout} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
            Endelea na Malipo
          </Button>
        </div>
      )}
    </div>
  );
}

// --- CHECKOUT SCREEN ---
function CheckoutScreen({ onBack, onPay }: { onBack: () => void, onPay: (order: any) => void }) {
  const { items, total, vendorId, vendorType, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [method, setMethod] = useState<'mongike' | 'lipanamba' | 'qr'>('mongike');

  const handlePayment = async () => {
    if (!vendorId) return;

    const orderData = {
      vendorId,
      subtotal: total,
      deliveryFee: 0,
      tax: 0,
      total: total,
      moduleType: vendorType || 'SHOP',
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress: 'Default Address'
    };

    createOrder.mutate(orderData, {
      onSuccess: (order) => {
        clearCart();
        onPay(order);
      }
    });
  };

  return (
    <div className="h-full bg-[#F8F9FA] flex flex-col pt-12">
      <div className="p-6 bg-white border-b flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-secondary" />
        </button>
        <h2 className="text-xl font-black text-secondary">Malipo</h2>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide">
        <div className="bg-white p-6 rounded-[2rem] border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Anwani ya Delivery</h4>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Badili</button>
          </div>
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
              <MapPin size={24} />
            </div>
            <div>
              <p className="font-black text-secondary text-sm">Nyumbani</p>
              <p className="text-xs font-medium text-text-secondary mt-1 leading-relaxed">Mtaa wa Morocco, Kinondoni, Dar es Salaam</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-secondary uppercase tracking-widest text-xs px-2">Njia ya Malipo</h4>
          
          <div className="space-y-4">
            <button 
              onClick={() => setMethod('mongike')}
              className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left space-y-4 relative overflow-hidden ${method === 'mongike' ? 'border-primary bg-orange-50/30' : 'border-border bg-white'}`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${method === 'mongike' ? 'border-primary' : 'border-border'}`}>
                    {method === 'mongike' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <span className="font-black text-secondary">Mobile Money (Mongike)</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-7 h-5 bg-red-600 rounded-md shadow-sm" />
                  <div className="w-7 h-5 bg-yellow-400 rounded-md shadow-sm" />
                  <div className="w-7 h-5 bg-blue-600 rounded-md shadow-sm" />
                </div>
              </div>
              <p className="text-xs font-medium text-text-secondary relative z-10">Italipwa kiotomatiki — ingiza PIN tu kwenye simu yako</p>
              <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest relative z-10">
                <ShieldCheck size={14} /> Salama na Mongike
              </div>
              {method === 'mongike' && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />}
            </button>

            <button 
              onClick={() => setMethod('lipanamba')}
              className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left space-y-4 ${method === 'lipanamba' ? 'border-primary bg-orange-50/30' : 'border-border bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${method === 'lipanamba' ? 'border-primary' : 'border-border'}`}>
                    {method === 'lipanamba' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <span className="font-black text-secondary">Lipa kwa Namba</span>
                </div>
                <CreditCard size={24} className="text-text-secondary" />
              </div>
              <p className="text-xs font-medium text-text-secondary">Lipa nje ya app kisha weka namba ya muamala</p>
            </button>

            <button 
              onClick={() => setMethod('qr')}
              className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left space-y-4 ${method === 'qr' ? 'border-primary bg-orange-50/30' : 'border-border bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${method === 'qr' ? 'border-primary' : 'border-border'}`}>
                    {method === 'qr' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <span className="font-black text-secondary">Scan QR Code</span>
                </div>
                <QrCode size={24} className="text-text-secondary" />
              </div>
              <p className="text-xs font-medium text-text-secondary">Scan QR code iliyopo kwenye duka au risiti</p>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white border-t border-border space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-2">
          <span className="text-text-secondary font-black uppercase tracking-widest text-[10px]">Jumla ya Malipo</span>
          <span className="text-3xl font-black text-secondary">TZS {total.toLocaleString()}</span>
        </div>
        <Button 
          onClick={handlePayment} 
          disabled={createOrder.isPending}
          className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {createOrder.isPending ? <Loader2 className="animate-spin" /> : 'Tuma Agizo'}
        </Button>
      </div>
    </div>
  );
}

// --- PROCESSING SCREEN ---
function ProcessingScreen({ order, onComplete }: { order: any, onComplete: (order: any) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(order), 3000);
    return () => clearTimeout(timer);
  }, [onComplete, order]);

  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-10 text-center space-y-12 pt-20">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
        />
        <div className="w-32 h-32 bg-orange-50 rounded-[3rem] flex items-center justify-center text-primary relative z-10 shadow-xl shadow-primary/10">
          <Phone size={64} className="animate-bounce" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-secondary tracking-tight">Subiri Kidogo...</h2>
        <p className="text-text-secondary font-bold px-4 leading-relaxed">Tunakutumia ombi la malipo kwenye simu yako <br /><span className="text-secondary">+255 768 *** 123</span></p>
      </div>

      <div className="w-full max-w-xs space-y-6 bg-gray-50 p-8 rounded-[2.5rem] border border-border">
        {[
          { label: 'Ombi limetumwa', done: true },
          { label: 'Subiri USSD kwenye simu', done: false, active: true },
          { label: 'Ingiza PIN ya M-Pesa', done: false },
          { label: 'Inathibitishwa...', done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${step.done ? 'bg-success text-white shadow-lg shadow-success/20' : step.active ? 'bg-primary text-white animate-pulse shadow-lg shadow-primary/20' : 'bg-white text-gray-300 border border-border'}`}>
              {step.done ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 bg-current rounded-full" />}
            </div>
            <span className={`text-sm font-black uppercase tracking-wider ${step.active ? 'text-primary' : step.done ? 'text-secondary' : 'text-gray-300'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4 space-y-4">
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Muda unaobaki: <span className="text-secondary">04:32</span></p>
        <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Sikupata Ombi?</button>
      </div>
    </div>
  );
}

// --- CONFIRMATION SCREEN ---
function ConfirmationScreen({ order, onHome }: { order: any, onHome: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col p-10 pt-20">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-40 h-40 bg-green-50 rounded-[3.5rem] flex items-center justify-center text-success shadow-xl shadow-success/10"
          >
            <CheckCircle2 size={96} strokeWidth={3} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-success/20 rounded-full -z-10"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-secondary tracking-tight leading-tight">Agizo <br />Limekubaliwa! 🎉</h2>
          <p className="text-text-secondary font-bold px-4 leading-relaxed">Agizo lako <span className="text-secondary font-black">#{order?.id?.slice(-8).toUpperCase() || 'SW-2024-0042'}</span> limepokelewa na linaanza kuandaliwa sasa hivi.</p>
        </div>

        <div className="w-full bg-gray-50 rounded-[2.5rem] p-8 space-y-6 border border-border shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-black uppercase tracking-widest text-[10px]">Muda wa Kufika</span>
            <span className="text-secondary font-black text-lg">Dakika 25-35</span>
          </div>
          <div className="h-px bg-border border-dashed border-border w-full" />
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-border">
              <Truck size={32} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Dereva wako</p>
              <p className="font-black text-secondary text-lg">Bakari Juma</p>
            </div>
            <div className="flex-1 flex justify-end gap-3">
              <button className="w-12 h-12 bg-success text-white rounded-2xl flex items-center justify-center shadow-lg shadow-success/20 active:scale-90 transition-transform"><Phone size={22} /></button>
              <button className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"><Bell size={22} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <Button variant="outline" className="w-full h-16 border-2 border-primary text-primary hover:bg-orange-50 rounded-2xl font-black text-lg transition-all active:scale-95">
          Fuatilia Agizo
        </Button>
        <Button onClick={onHome} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
          Rudi Nyumbani
        </Button>
      </div>
    </div>
  );
}

// --- PROFILE SCREEN ---
function ProfileScreen({ onBack, onLogout }: { onBack: () => void, onLogout: () => void }) {
  const { user } = useAuth();
  const { data: orders, isLoading } = useCustomerOrders();

  return (
    <div className="h-full bg-[#F8F9FA] flex flex-col pt-12">
      <div className="p-6 bg-white border-b flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-secondary" />
        </button>
        <h2 className="text-xl font-black text-secondary">Akaunti Yangu</h2>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-border flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 p-1 border-2 border-primary/20">
            <img 
              src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&size=200`} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-[1.8rem]"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-secondary">{user?.name || 'Mteja'}</h3>
            <p className="text-sm font-bold text-text-secondary">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-orange-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-secondary uppercase tracking-widest text-xs px-2">Historia ya Oda</h4>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : orders?.length > 0 ? (
              orders.map((order: any) => (
                <div key={order.id} className="bg-white p-5 rounded-[2rem] border border-border shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-secondary">
                        <Package size={20} />
                      </div>
                      <div>
                        <h5 className="font-black text-secondary text-sm">Oda #{order.id.slice(-5)}</h5>
                        <p className="text-[10px] font-bold text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                      order.status === 'DELIVERED' ? 'bg-green-50 text-success' : 
                      order.status === 'CANCELLED' ? 'bg-red-50 text-danger' : 
                      'bg-blue-50 text-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                    <span className="text-xs font-bold text-text-secondary">{order.items.length} Bidhaa</span>
                    <span className="font-black text-secondary text-sm">TZS {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-border">
                <p className="text-xs font-bold text-text-secondary">Huna oda bado</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-danger rounded-[2rem] border border-red-100 font-black uppercase tracking-widest text-sm hover:bg-danger hover:text-white transition-all shadow-sm active:scale-95"
        >
          <LogOut size={20} />
          Ondoka Kwenye App
        </button>
      </div>
    </div>
  );
}

// --- MAIN WRAPPER ---
export default function CustomerApp() {
  const { logout } = useAuth();
  const [step, setStep] = useState<'splash' | 'onboarding' | 'home' | 'detail' | 'cart' | 'checkout' | 'processing' | 'confirmation' | 'profile'>('splash');
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleNavigate = (newStep: any, data?: any) => {
    if (data) setSelectedData(data);
    setStep(newStep);
  };

  if (step === 'splash') return <SplashScreen onComplete={() => setStep('onboarding')} />;
  if (step === 'onboarding') return <OnboardingScreen onFinish={() => setStep('home')} />;
  
  return (
    <div className="h-full w-full relative bg-[#F8F9FA]">
      <AnimatePresence mode="wait">
        {step === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <HomeScreen onNavigate={handleNavigate} />
          </motion.div>
        )}
        {step === 'detail' && (
          <motion.div key="detail" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-50">
            <ProductDetail vendor={selectedData} onBack={() => setStep('home')} />
          </motion.div>
        )}
        {step === 'cart' && (
          <motion.div key="cart" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-50">
            <CartScreen onBack={() => setStep('home')} onCheckout={() => setStep('checkout')} />
          </motion.div>
        )}
        {step === 'checkout' && (
          <motion.div key="checkout" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-50">
            <CheckoutScreen onBack={() => setStep('cart')} onPay={(order) => handleNavigate('processing', order)} />
          </motion.div>
        )}
        {step === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full absolute inset-0 z-50">
            <ProcessingScreen order={selectedData} onComplete={(order) => handleNavigate('confirmation', order)} />
          </motion.div>
        )}
        {step === 'confirmation' && (
          <motion.div key="confirmation" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full absolute inset-0 z-50">
            <ConfirmationScreen order={selectedData} onHome={() => setStep('home')} />
          </motion.div>
        )}
        {step === 'profile' && (
          <motion.div key="profile" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-50">
            <ProfileScreen onBack={() => setStep('home')} onLogout={logout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
