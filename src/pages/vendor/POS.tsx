import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  User, 
  Phone,
  Printer,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  images: string[];
  unit: string;
  isPrescriptionRequired: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POS() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY'>('CASH');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['vendor-products', user?.vendor?.id],
    queryFn: async () => {
      const response = await api.get(`/vendor/products`);
      return response.data as Product[];
    },
    enabled: !!user?.vendor?.id
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    if (product.stockQty <= 0) {
      toast.error('Bidhaa haina stock');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQty) {
          toast.error('Stock haitoshi');
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stockQty) {
          toast.error('Stock haitoshi');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Can add tax/discount here

  const saleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const response = await api.post('/pos/sale', saleData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Mauzo yamekamilika!');
      setLastSale(data);
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setIsCheckoutModalOpen(false);
      setIsReceiptModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Imeshindwa kukamilisha mauzo');
    }
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart ni tupu');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const confirmSale = () => {
    saleMutation.mutate({
      vendorId: user?.vendor?.id,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      paymentMethod,
      total,
      subtotal,
      discount: 0,
      customerName,
      customerPhone
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6">
      {/* Left Side: Product Selection */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              placeholder="Tafuta bidhaa kwa jina au SKU..." 
              className="pl-12 h-12 bg-gray-50 border-none rounded-xl font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 rounded-xl font-bold px-6">Zote</Button>
            <Button variant="outline" className="h-12 rounded-xl font-bold px-6">Dawa</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white h-48 rounded-2xl animate-pulse border" />
            ))
          ) : filteredProducts.map(product => (
            <motion.div 
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(product)}
              className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-md group ${product.stockQty <= 0 ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingCart size={32} />
                  </div>
                )}
                {product.stockQty <= 5 && product.stockQty > 0 && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    Low Stock
                  </div>
                )}
              </div>
              <h3 className="font-black text-sm text-[#1A1A2E] truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#FF6B35] font-black text-xs">TZS {product.price.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-gray-400">{product.stockQty} {product.unit || 'pcs'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="flex-1 bg-white rounded-3xl shadow-xl border overflow-hidden flex flex-col">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FF6B35]/20">
                <ShoppingCart size={20} />
              </div>
              <h2 className="font-black text-[#1A1A2E]">Oda ya Sasa</h2>
            </div>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest">
              {cart.length} Items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="font-bold">Cart ni tupu. Chagua bidhaa kuanza mauzo.</p>
                </div>
              ) : cart.map(item => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden shrink-0">
                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <ShoppingCart size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#1A1A2E] truncate">{item.name}</h4>
                    <p className="text-[10px] font-black text-[#FF6B35]">TZS {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] border"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] border"
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-gray-50/50 border-t space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-500">Subtotal</span>
                <span className="font-black text-[#1A1A2E]">TZS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-500">Punguzo</span>
                <span className="font-black text-green-600">-TZS 0</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-black text-[#1A1A2E]">JUMLA</span>
                <span className="text-2xl font-black text-[#FF6B35]">TZS {total.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full h-14 bg-[#1A1A2E] hover:bg-[#2A2A4E] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1A1A2E]/20"
            >
              LIPISHA SASA
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-black text-[#1A1A2E]">Kamilisha Mauzo</h3>
                <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Taarifa za Mteja (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Jina</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          placeholder="Jina la mteja" 
                          className="pl-10 h-11 rounded-xl font-bold"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Simu</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          placeholder="07XXXXXXXX" 
                          className="pl-10 h-11 rounded-xl font-bold"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Njia ya Malipo</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Banknote size={24} className={paymentMethod === 'CASH' ? 'text-[#FF6B35]' : 'text-gray-400'} />
                      <span className="text-xs font-black uppercase">Cash</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('MOBILE_MONEY')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'MOBILE_MONEY' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <CreditCard size={24} className={paymentMethod === 'MOBILE_MONEY' ? 'text-[#FF6B35]' : 'text-gray-400'} />
                      <span className="text-xs font-black uppercase">Mobile Money</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Jumla ya Kulipa</span>
                    <span className="text-2xl font-black text-[#1A1A2E]">TZS {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={confirmSale}
                  disabled={saleMutation.isPending}
                  className="w-full h-14 bg-[#FF6B35] hover:bg-[#FF8C61] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#FF6B35]/20"
                >
                  {saleMutation.isPending ? 'Inatuma...' : 'THIBITISHA MAUZO'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {isReceiptModalOpen && lastSale && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1A1A2E]">Mauzo Yamekamilika!</h3>
                  <p className="text-sm font-bold text-gray-500 mt-1">Oda ID: {lastSale.id.slice(0, 8).toUpperCase()}</p>
                </div>

                <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 space-y-4 text-left">
                  <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                    <span>Bidhaa</span>
                    <span>Bei</span>
                  </div>
                  <div className="space-y-2">
                    {lastSale.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="font-bold text-[#1A1A2E]">{item.quantity}x {item.name}</span>
                        <span className="font-black">TZS {item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-dashed flex justify-between items-center">
                    <span className="font-black text-[#1A1A2E]">JUMLA</span>
                    <span className="text-xl font-black text-[#FF6B35]">TZS {lastSale.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 rounded-xl font-bold gap-2">
                    <Printer size={18} /> Print
                  </Button>
                  <Button 
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="h-12 bg-[#1A1A2E] text-white rounded-xl font-bold"
                  >
                    Funga
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
