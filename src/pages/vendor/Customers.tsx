import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Search, User, Mail, Phone, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { format } from 'date-fns';

export default function VendorCustomers() {
  const [search, setSearch] = useState('');
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['vendor-customers', search],
    queryFn: async () => {
      const response = await api.get('/vendor/customers', { params: { search } });
      return response.data;
    }
  });

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Usimamizi wa Wateja</h1>
            <p className="text-[#6B7280] font-bold">Angalia orodha na historia ya wateja wako.</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/30">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tafuta mteja kwa jina au simu..." 
                className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-[#FF6B35]" size={48} />
              <p className="text-[#6B7280] font-black uppercase tracking-widest">Inapakia Wateja...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {customers?.map((customer: any) => (
                <div key={customer.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl hover:border-[#FF6B35]/20 transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A2E] group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-[#1A1A2E] text-lg leading-tight">{customer.name}</h3>
                      <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Mteja tangu {format(new Date(customer.createdAt), 'MMM yyyy')}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-bold text-[#6B7280]">
                      <Phone size={16} className="text-[#FF6B35]" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-[#6B7280]">
                      <Mail size={16} className="text-[#FF6B35]" />
                      {customer.email || 'Haikupatikana'}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#E5E7EB] grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                      <p className="text-[10px] font-black text-[#6B7280] uppercase mb-1">Jumla ya Oda</p>
                      <p className="text-lg font-black text-[#1A1A2E]">{customer._count?.orders || 0}</p>
                    </div>
                    <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                      <p className="text-[10px] font-black text-[#6B7280] uppercase mb-1">Matumizi</p>
                      <p className="text-lg font-black text-[#FF6B35]">TSH {customer.totalSpent?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </div>
              ))}

              {(!customers || customers.length === 0) && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <User size={40} />
                  </div>
                  <p className="text-[#6B7280] font-black uppercase tracking-widest">Hakuna wateja waliopatikana.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
