import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Package, 
  Clock, 
  DollarSign, 
  Bell, 
  User, 
  Power,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageSquare,
  ArrowRight,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAvailableOrders, useAcceptOrder, useActiveOrder, useUpdateDeliveryStatus } from '@/hooks/useDriver';
import { toast } from 'sonner';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'active' | 'earnings'>('orders');
  
  const { data: availableOrders, isLoading: loadingAvailable } = useAvailableOrders();
  const { data: activeOrder, isLoading: loadingActive } = useActiveOrder();
  const acceptOrderMutation = useAcceptOrder();
  const updateStatusMutation = useUpdateDeliveryStatus();

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrderMutation.mutateAsync(orderId);
      toast.success('Oda imekubaliwa! Nenda kachukue mzigo.');
      setActiveTab('active');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Imeshindwa kukubali oda');
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      toast.success(`Hali ya oda imebadilika kuwa ${status}`);
    } catch (error) {
      toast.error('Imeshindwa kubadilisha hali ya oda');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border border-border">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Driver'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-secondary leading-tight">{user?.name || 'Dereva'}</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-text-secondary">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                4.9 • {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              isOnline 
                ? 'bg-success text-white shadow-success/20' 
                : 'bg-gray-100 text-text-secondary shadow-gray-200'
            }`}
          >
            <Power size={24} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-white p-4 rounded-3xl border border-border shadow-sm text-center">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Leo</p>
          <p className="text-lg font-black text-secondary">0</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-border shadow-sm text-center">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Masaa</p>
          <p className="text-lg font-black text-secondary">0</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-border shadow-sm text-center">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Mapato</p>
          <p className="text-lg font-black text-primary">0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {!isOnline ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-text-secondary">
              <Power size={48} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-secondary">Uko Offline</h4>
              <p className="text-sm font-bold text-text-secondary">Washa kitufe cha juu kuanza kazi</p>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <>
            <div className="flex items-center justify-between px-2">
              <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Oda Zinazopatikana</h4>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">{(availableOrders?.length || 0)} MPYA</span>
            </div>

            <div className="space-y-4">
              {loadingAvailable ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
              ) : availableOrders?.length > 0 ? (
                availableOrders.map((order: any) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-border p-6 shadow-sm space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
                          <Package size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-secondary">{order.vendor?.businessName}</h5>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Hivi sasa</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">TZS {order.deliveryFee?.toLocaleString() || '2,500'}</p>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Karibu</p>
                      </div>
                    </div>

                    <div className="space-y-4 relative">
                      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 border-l-2 border-dashed border-border"></div>
                      
                      <div className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">KUCHUKUA</p>
                          <p className="text-sm font-bold text-secondary truncate">{order.vendor?.address}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center z-10">
                          <MapPin size={12} className="text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">KUFIKISHA</p>
                          <p className="text-sm font-bold text-secondary truncate">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={acceptOrderMutation.isPending}
                      className="w-full h-14 bg-secondary hover:bg-secondary/90 rounded-2xl font-black text-sm shadow-xl shadow-secondary/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {acceptOrderMutation.isPending ? <Loader2 className="animate-spin" /> : 'KUBALI ODA'} <ArrowRight size={18} />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center opacity-50">
                  <p className="font-bold">Hakuna oda kwa sasa.</p>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'active' ? (
          <div className="space-y-6">
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs px-2">Oda Inayoendelea</h4>
            {loadingActive ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : activeOrder ? (
              <div className="bg-white rounded-[2.5rem] border border-border p-6 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Package size={28} />
                    </div>
                    <div>
                      <h5 className="text-xl font-black text-secondary">#{activeOrder.id.slice(-6).toUpperCase()}</h5>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        activeOrder.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {activeOrder.status === 'ACCEPTED' ? 'Inasubiri Kuchukuliwa' : 'Mzigo Umechukuliwa'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-secondary border border-border">
                      <Phone size={20} />
                    </button>
                    <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-secondary border border-border">
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 border-l-2 border-dashed border-border"></div>
                  
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">KUTOKA</p>
                      <p className="text-base font-black text-secondary">{activeOrder.vendor?.businessName}</p>
                      <p className="text-sm font-bold text-text-secondary">{activeOrder.vendor?.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center z-10">
                      <MapPin size={12} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">KWENDA KWA</p>
                      <p className="text-base font-black text-secondary">{activeOrder.customer?.name}</p>
                      <p className="text-sm font-bold text-text-secondary">{activeOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-border">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">BIDHAA</p>
                  <div className="space-y-3">
                    {activeOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm font-bold text-secondary">{item.quantity}x {item.name}</span>
                        <span className="text-sm font-black text-secondary">TZS {item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeOrder.status === 'ACCEPTED' ? (
                  <Button 
                    onClick={() => handleUpdateStatus(activeOrder.id, 'PICKED_UP')}
                    className="w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                  >
                    NIMECHUKUA MZIGO
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleUpdateStatus(activeOrder.id, 'DELIVERED')}
                    className="w-full h-16 bg-success text-white rounded-2xl font-black text-lg shadow-xl shadow-success/20"
                  >
                    NIMEFIKISHA MZIGO
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-20 text-center opacity-50">
                <p className="font-bold">Huna oda inayoendelea kwa sasa.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center opacity-50">
            <p className="font-bold">Sehemu ya mapato inakuja hivi karibuni.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 pb-8 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-primary' : 'text-text-secondary'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'orders' ? 'bg-primary/10' : ''}`}>
            <Package size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Oda</span>
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'active' ? 'text-primary' : 'text-text-secondary'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'active' ? 'bg-primary/10' : ''}`}>
            <Navigation size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Inayoendelea</span>
        </button>
        <button 
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'earnings' ? 'text-primary' : 'text-text-secondary'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'earnings' ? 'bg-primary/10' : ''}`}>
            <DollarSign size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Mapato</span>
        </button>
      </div>
    </div>
  );
}
