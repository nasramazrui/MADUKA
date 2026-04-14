import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Search, Filter, MoreHorizontal, Eye, Loader2, ShoppingBag } from 'lucide-react';
import { useVendorOrders, useUpdateOrderStatus } from '@/hooks/useVendor';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function VendorOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('Zote');
  const { data: orders, isLoading } = useVendorOrders(statusFilter === 'Zote' ? undefined : statusFilter.toUpperCase());
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
  };

  const statusMap: Record<string, string> = {
    'Zote': 'All',
    'Mpya': 'PLACED',
    'Zilizothibitishwa': 'CONFIRMED',
    'Zinazoandaliwa': 'PREPARING',
    'Tayari': 'READY',
    'Zilizofika': 'DELIVERED',
    'Zilizoghairiwa': 'CANCELLED'
  };

  const swahiliStatuses: Record<string, string> = {
    'PLACED': 'Mpya',
    'CONFIRMED': 'Imethibitishwa',
    'PREPARING': 'Inaandaliwa',
    'READY': 'Tayari',
    'DELIVERED': 'Imefika',
    'CANCELLED': 'Imeghairiwa'
  };

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Usimamizi wa Oda</h1>
            <p className="text-[#6B7280] font-bold">Fuatilia na dhibiti oda za wateja wako hapa.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-black text-[#1A1A2E] hover:bg-gray-50 transition-all uppercase tracking-widest">
              <Filter size={18} /> Chuja
            </button>
            <button className="px-6 py-3 bg-[#FF6B35] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#FF6B35]/20 hover:bg-[#FF6B35]/90 transition-all uppercase tracking-widest">
              Pakua Ripoti (CSV)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/30">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="text" 
                placeholder="Tafuta kwa ID au Jina la Mteja..." 
                className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {Object.keys(statusMap).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                    statusFilter === tab ? 'bg-[#1A1A2E] text-white shadow-lg' : 'text-[#6B7280] hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-[#FF6B35]" size={48} />
              <p className="text-[#6B7280] font-black uppercase tracking-widest">Inapakia Oda...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] text-[#6B7280] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#E5E7EB]">
                    <th className="px-8 py-5">ID ya Oda</th>
                    <th className="px-8 py-5">Mteja</th>
                    <th className="px-8 py-5">Tarehe</th>
                    <th className="px-8 py-5">Jumla</th>
                    <th className="px-8 py-5">Hali</th>
                    <th className="px-8 py-5 text-right">Kitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <AnimatePresence mode="popLayout">
                    {orders?.map((order: any) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6 font-black text-[#1A1A2E] text-sm tracking-tight">#{order.id.slice(-6).toUpperCase()}</td>
                        <td className="px-8 py-6">
                          <p className="font-black text-[#1A1A2E] text-sm">{order.customer?.name}</p>
                          <p className="text-xs text-[#6B7280] font-bold">{order.customer?.phone}</p>
                        </td>
                        <td className="px-8 py-6 text-sm text-[#6B7280] font-bold">
                          {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                        </td>
                        <td className="px-8 py-6 font-black text-[#1A1A2E] text-sm">TSH {order.total.toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-2 transition-all ${
                              order.status === 'PLACED' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' :
                              'bg-red-50 text-red-600 border-red-100'
                            }`}
                          >
                            {Object.entries(swahiliStatuses).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#FF6B35] hover:border-[#FF6B35]/20 transition-all">
                              <Eye size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A2E] transition-all">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {(!orders || orders.length === 0) && (
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-[#6B7280] font-black uppercase tracking-widest">Hakuna oda zilizopatikana.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="p-8 border-t border-[#E5E7EB] flex items-center justify-between bg-gray-50/30">
            <p className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Inaonyesha oda {orders?.length || 0}</p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#6B7280] uppercase tracking-widest disabled:opacity-30" disabled>Iliyopita</button>
              <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#1A1A2E] uppercase tracking-widest hover:bg-gray-50 transition-all">Inayofuata</button>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
