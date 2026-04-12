import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Ticket, 
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQty, 
    vendorName, 
    getSubtotal, 
    getTotal, 
    discount, 
    deliveryFee,
    promoCode,
    applyPromoCode
  } = useCartStore();
  
  const [promoInput, setPromoInput] = useState('');
  const subtotal = getSubtotal();
  const vat = subtotal * 0.18;
  const total = getTotal() + vat;

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === 'SWIFT50') {
      applyPromoCode('SWIFT50', 5000);
      toast.success('Punguzo la TZS 5,000 limetumika!');
    } else {
      toast.error('Msimbo huu si sahihi');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-black/5"
        >
          <ShoppingBag size={80} className="text-[#E5E7EB]" />
        </motion.div>
        <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">Cart yako iko wazi</h2>
        <p className="text-[#6B7280] font-medium mb-8 max-w-[280px]">
          Inaonekana bado hujaongeza bidhaa yoyote kwenye cart yako.
        </p>
        <Button 
          onClick={() => navigate('/home')}
          className="w-full max-w-xs h-14 bg-[#FF6B35] rounded-2xl font-black text-lg shadow-lg shadow-[#FF6B35]/20"
        >
          Anza Kununua
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 px-4 h-16 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-[#F8F9FA] rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-black text-[#1A1A2E]">Cart Yangu</h1>
        </div>
        <button 
          onClick={() => useCartStore.getState().clearCart()}
          className="text-xs font-bold text-[#EF4444] hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
        >
          Futa Zote
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Vendor Info */}
        <div className="flex items-center justify-between bg-[#FF6B35]/5 p-4 rounded-2xl border border-[#FF6B35]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest">Agizo kutoka</p>
              <h3 className="font-black text-[#1A1A2E]">{vendorName}</h3>
            </div>
          </div>
          <button onClick={() => navigate('/home')} className="text-xs font-bold text-[#FF6B35] flex items-center gap-1">
            Ongeza zaidi <ChevronRight size={14} />
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-4 rounded-[24px] border border-[#E5E7EB] shadow-sm flex gap-4 relative group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-[#1A1A2E] text-sm leading-tight max-w-[140px]">{item.name}</h4>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-[#6B7280] hover:text-[#EF4444] p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#FF6B35]">TZS {(item.price * item.qty).toLocaleString()}</span>
                    <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl p-1 border border-[#E5E7EB]">
                      <button 
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1A2E] hover:bg-white rounded-lg transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1A2E] hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Code */}
        <div className="bg-white p-4 rounded-[24px] border border-[#E5E7EB] space-y-4">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <Ticket size={20} className="text-[#FF6B35]" />
            <span className="text-sm font-black uppercase tracking-wider">Msimbo wa Punguzo</span>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Ingiza msimbo hapa" 
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="h-12 rounded-xl border-[#E5E7EB] font-bold uppercase"
            />
            <Button 
              onClick={handleApplyPromo}
              className="h-12 px-6 bg-[#1A1A2E] text-white rounded-xl font-black"
            >
              Tumia
            </Button>
          </div>
          {promoCode && (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 text-green-700">
                <Check size={16} strokeWidth={3} />
                <span className="text-xs font-black uppercase">{promoCode} applied</span>
              </div>
              <button onClick={() => applyPromoCode('', 0)} className="text-xs font-bold text-green-700 underline">Ondoa</button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] space-y-4 shadow-sm">
          <h3 className="font-black text-[#1A1A2E] uppercase tracking-wider text-xs mb-2">Muhtasari wa Malipo</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-[#6B7280]">Jumla ya bidhaa</span>
              <span className="font-black text-[#1A1A2E]">TZS {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-[#6B7280]">Ada ya delivery</span>
              <span className="font-black text-[#1A1A2E]">TZS {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-[#6B7280]">VAT (18%)</span>
              <span className="font-black text-[#1A1A2E]">TZS {vat.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[#0F9B58]">
                <span className="font-bold">Punguzo</span>
                <span className="font-black">-TZS {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-4 border-t border-[#F8F9FA] flex justify-between items-center">
              <span className="text-lg font-black text-[#1A1A2E]">JUMLA</span>
              <span className="text-2xl font-black text-[#FF6B35]">TZS {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Safety Info */}
        <div className="flex items-center justify-center gap-2 py-4">
          <ShieldCheck size={18} className="text-[#0F9B58]" />
          <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Malipo Salama na SwiftApp ⚡</span>
        </div>
      </div>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] z-50">
        <Button 
          onClick={() => navigate('/checkout')}
          className="w-full h-16 bg-[#FF6B35] hover:bg-[#FF8C61] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#FF6B35]/20 flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          Endelea na Malipo <ArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
}
