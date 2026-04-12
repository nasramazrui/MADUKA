import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Info, 
  ChevronRight,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'info' | 'reviews'>('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addItem, items, updateQty } = useCartStore();

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      // Mock vendor data
      return {
        id: id,
        businessName: 'Karibu Restaurant',
        businessType: 'RESTAURANT',
        description: 'Best grilled chicken and local dishes in Kinondoni. We use fresh ingredients daily.',
        address: 'Mwananyamala, Kinondoni, Dar es Salaam',
        avgRating: 4.8,
        totalOrders: 1240,
        logoUrl: 'https://picsum.photos/seed/logo1/200',
        coverUrl: 'https://picsum.photos/seed/cover1/800/400',
        businessHours: {
          Mon: '08:00 - 22:00',
          Tue: '08:00 - 22:00',
          Wed: '08:00 - 22:00',
          Thu: '08:00 - 22:00',
          Fri: '08:00 - 23:00',
          Sat: '09:00 - 23:00',
          Sun: '10:00 - 21:00',
        }
      };
    }
  });

  const { data: products } = useQuery({
    queryKey: ['vendor-products', id],
    queryFn: async () => [
      { id: 'p1', name: 'Kuku wa Kuchoma', price: 12000, category: 'Main', images: ['https://picsum.photos/seed/p1/300'] },
      { id: 'p2', name: 'Chips Mayai', price: 5000, category: 'Fast Food', images: ['https://picsum.photos/seed/p2/300'] },
      { id: 'p3', name: 'Wali wa Nazi', price: 8000, category: 'Main', images: ['https://picsum.photos/seed/p3/300'] },
      { id: 'p4', name: 'Juice ya Embe', price: 3000, category: 'Drinks', images: ['https://picsum.photos/seed/p4/300'] },
    ]
  });

  const categories = ['All', ...new Set(products?.map(p => p.category) || [])];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products?.filter(p => p.category === selectedCategory);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Parallax Cover */}
      <div className="relative h-[200px] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          src={vendor?.coverUrl} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1A1A2E] shadow-lg"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Vendor Info Header */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg -mt-16 bg-white">
              <img src={vendor?.logoUrl} alt={vendor?.businessName} className="w-full h-full object-cover" />
            </div>
            <div className="bg-[#0F9B58] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Wazi Sasa
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-black text-[#1A1A2E]">{vendor?.businessName}</h1>
            <p className="text-sm font-bold text-[#6B7280]">{vendor?.businessType} • {vendor?.address.split(',')[0]}</p>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#F8F9FA]">
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-black text-[#1A1A2E]">{vendor?.avgRating}</span>
              <span className="text-xs font-bold text-[#6B7280]">(1.2k+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={18} className="text-[#6B7280]" />
              <span className="text-sm font-black text-[#1A1A2E]">25-35 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={18} className="text-[#6B7280]" />
              <span className="text-sm font-black text-[#1A1A2E]">TZS 2k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 px-4">
        <div className="flex bg-white p-1 rounded-2xl border border-[#E5E7EB]">
          {[
            { id: 'products', label: 'Bidhaa', icon: ShoppingBag },
            { id: 'info', label: 'Maelezo', icon: Info },
            { id: 'reviews', label: 'Maoni', icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                  : 'text-[#6B7280] hover:bg-[#F8F9FA]'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Category Pills */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-[#1A1A2E] text-white' 
                        : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts?.map((product) => {
                  const cartItem = items.find(i => i.productId === product.id);
                  return (
                    <div key={product.id} className="bg-white rounded-[24px] overflow-hidden border border-[#E5E7EB] shadow-sm flex flex-col">
                      <div className="aspect-square relative">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1A1A2E] shadow-md">
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-[#1A1A2E] text-sm leading-tight">{product.name}</h4>
                          <p className="text-[10px] font-bold text-[#6B7280] mt-1 uppercase tracking-wider">{product.category}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[#FF6B35] font-black text-sm">TZS {product.price.toLocaleString()}</span>
                          {cartItem ? (
                            <div className="flex items-center gap-2 bg-[#F8F9FA] rounded-xl p-1">
                              <button 
                                onClick={() => updateQty(product.id, cartItem.qty - 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#1A1A2E]"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-xs font-black">{cartItem.qty}</span>
                              <button 
                                onClick={() => updateQty(product.id, cartItem.qty + 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#1A1A2E]"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addItem(product as any, vendor as any)}
                              className="w-8 h-8 bg-[#FF6B35] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20"
                            >
                              <Plus size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] space-y-4">
                <h3 className="font-black text-[#1A1A2E] flex items-center gap-2">
                  <Info size={18} className="text-[#FF6B35]" /> Kuhusu Muuzaji
                </h3>
                <p className="text-sm font-medium text-[#6B7280] leading-relaxed">
                  {vendor?.description}
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl font-bold gap-2">
                    <Phone size={18} /> Piga Simu
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl font-bold gap-2">
                    <MessageSquare size={18} /> Ongea
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] space-y-4">
                <h3 className="font-black text-[#1A1A2E] flex items-center gap-2">
                  <MapPin size={18} className="text-[#FF6B35]" /> Mahali na Saa
                </h3>
                <div className="h-40 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] text-sm font-bold">
                  Mini Map Coming Soon
                </div>
                <p className="text-sm font-bold text-[#1A1A2E]">{vendor?.address}</p>
                
                <div className="space-y-3 pt-4 border-t border-[#F8F9FA]">
                  {Object.entries(vendor?.businessHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="font-bold text-[#6B7280]">{day}</span>
                      <span className="font-black text-[#1A1A2E]">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] flex items-center gap-8">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-[#1A1A2E]">{vendor?.avgRating}</h2>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-[#6B7280] mt-2 uppercase tracking-wider">234 Maoni</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#6B7280] w-3">{star}</span>
                      <div className="flex-1 h-1.5 bg-[#F8F9FA] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F59E0B]" 
                          style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-4 rounded-[24px] border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center font-black text-[#FF6B35]">
                          {['A', 'J', 'M'][i-1]}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-[#1A1A2E]">{['Amina H.', 'John D.', 'Musa K.'][i-1]}</h4>
                          <p className="text-[10px] font-bold text-[#6B7280]">Leo 14:32</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#6B7280] leading-relaxed">
                      "Chakula kilikuwa kizuri sana na kilifika kikiwa bado cha moto. Nitagiza tena hapa!"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Cart Bar */}
      {items.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-4 right-4 z-50"
        >
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-[#1A1A2E] h-16 rounded-2xl flex items-center justify-between px-6 shadow-2xl shadow-black/20 group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white font-black text-sm">
                {items.reduce((sum, i) => sum + i.qty, 0)}
              </div>
              <span className="text-white font-black">Angalia Cart</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-black">TZS {useCartStore.getState().getSubtotal().toLocaleString()}</span>
              <ArrowRight className="text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
