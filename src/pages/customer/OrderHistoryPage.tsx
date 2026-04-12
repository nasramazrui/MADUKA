import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  RotateCcw,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const { data: orders } = useQuery({
    queryKey: ['orders', activeTab],
    queryFn: async () => {
      // Mock orders
      if (activeTab === 'active') {
        return [
          { 
            id: 'ORD-1234', 
            vendorName: 'Karibu Restaurant', 
            vendorLogo: 'https://picsum.photos/seed/v1/100',
            status: 'OUT_FOR_DELIVERY',
            items: 'Kuku wa Kuchoma + 2 more',
            total: 24500,
            createdAt: new Date().toISOString(),
            itemsCount: 3
          }
        ];
      }
      return [
        { 
          id: 'ORD-1100', 
          vendorName: 'City Grocery', 
          vendorLogo: 'https://picsum.photos/seed/v2/100',
          status: 'DELIVERED',
          items: 'Maziwa, Mkate, Mayai',
          total: 12000,
          createdAt: '2026-04-10T14:30:00Z',
          itemsCount: 5
        },
        { 
          id: 'ORD-1090', 
          vendorName: 'Amana Pharmacy', 
          vendorLogo: 'https://picsum.photos/seed/v3/100',
          status: 'CANCELLED',
          items: 'Panadol, Vitamin C',
          total: 8500,
          createdAt: '2026-04-08T10:15:00Z',
          itemsCount: 2
        }
      ];
    }
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Inasubiri', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock };
      case 'PROCESSING': return { label: 'Inatayarishwa', color: 'text-blue-600', bg: 'bg-blue-50', icon: Package };
      case 'OUT_FOR_DELIVERY': return { label: 'Njia Kuja', color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/5', icon: Truck };
      case 'DELIVERED': return { label: 'Imefika', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 };
      case 'CANCELLED': return { label: 'Imeghairiwa', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
      default: return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', icon: Package };
    }
  };

  return (
    <CustomerLayout title="Maagizo Yangu">
      <div className="px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
              activeTab === 'active' 
                ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                : 'text-[#6B7280] hover:bg-[#F8F9FA]'
            }`}
          >
            Yanayoendelea
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
              activeTab === 'history' 
                ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                : 'text-[#6B7280] hover:bg-[#F8F9FA]'
            }`}
          >
            Yaliyopita
          </button>
        </div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {orders?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#E5E7EB] shadow-sm">
                  <Package size={40} />
                </div>
                <div>
                  <h3 className="font-black text-[#1A1A2E]">Huna maagizo hapa</h3>
                  <p className="text-sm font-bold text-[#6B7280] mt-1">Anza kuagiza sasa ufurahie huduma zetu</p>
                </div>
              </div>
            ) : (
              orders?.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                  <div 
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-white p-5 rounded-[32px] border border-[#E5E7EB] shadow-sm space-y-4 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#F8F9FA]">
                          <img src={order.vendorLogo} alt={order.vendorName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-black text-[#1A1A2E]">{order.vendorName}</h4>
                          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{order.id}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                        <status.icon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{status.label}</span>
                      </div>
                    </div>

                    <div className="py-4 border-y border-[#F8F9FA] space-y-2">
                      <p className="text-sm font-medium text-[#1A1A2E] line-clamp-1">
                        {order.items}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#6B7280]">
                          {new Date(order.createdAt).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm font-black text-[#1A1A2E]">TZS {order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {activeTab === 'active' ? (
                        <button className="flex-1 h-12 bg-[#FF6B35] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FF6B35]/20 flex items-center justify-center gap-2">
                          Fuatilia Agizo <ArrowRight size={16} />
                        </button>
                      ) : (
                        <>
                          <button className="flex-1 h-12 bg-[#F8F9FA] text-[#1A1A2E] rounded-xl font-black text-xs uppercase tracking-widest border border-[#E5E7EB] flex items-center justify-center gap-2">
                            <RotateCcw size={16} /> Agiza Tena
                          </button>
                          <button className="h-12 px-4 bg-white text-[#1A1A2E] rounded-xl font-black text-xs uppercase tracking-widest border border-[#E5E7EB] flex items-center justify-center">
                            Maoni
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </CustomerLayout>
  );
}
