import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Search, CheckCircle, XCircle, Eye, Loader2, Store, ShieldCheck, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminVendorsPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['admin-vendors', search],
    queryFn: async () => {
      const response = await api.get('/admin/vendors', { params: { search } });
      return response.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const response = await api.patch(`/admin/vendors/${id}/approve`, { approved });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast.success('Hali ya muuzaji imesasishwa');
    }
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Usimamizi wa Wauzaji</h1>
          <p className="text-[#6B7280] font-bold">Thibitisha na dhibiti wauzaji wote kwenye mfumo.</p>
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
              placeholder="Tafuta muuzaji kwa jina au duka..." 
              className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#FF6B35]" size={48} />
            <p className="text-[#6B7280] font-black uppercase tracking-widest">Inapakia Wauzaji...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] text-[#6B7280] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#E5E7EB]">
                  <th className="px-8 py-5">Muuzaji / Biashara</th>
                  <th className="px-8 py-5">Aina ya Biashara</th>
                  <th className="px-8 py-5">Tarehe ya Usajili</th>
                  <th className="px-8 py-5">Hali</th>
                  <th className="px-8 py-5 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {vendors?.map((vendor: any) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A2E]">
                          {vendor.businessLogo ? (
                            <img src={vendor.businessLogo} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Store size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#1A1A2E] text-sm">{vendor.businessName}</p>
                          <p className="text-xs text-[#6B7280] font-bold">{vendor.user?.name} • {vendor.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-[#1A1A2E] rounded-full text-[10px] font-black uppercase tracking-widest">
                        {vendor.businessType}
                        {vendor.isWholesaler && ' (Jumla)'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-[#6B7280] font-bold">
                      {format(new Date(vendor.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-8 py-6">
                      {vendor.isApproved ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <ShieldCheck size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Imethibitishwa</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-500">
                          <ShieldAlert size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Inasubiri</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#FF6B35] transition-all">
                          <Eye size={18} />
                        </button>
                        {vendor.isApproved ? (
                          <button 
                            onClick={() => approveMutation.mutate({ id: vendor.id, approved: false })}
                            className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 hover:bg-red-100 transition-all"
                            title="Batilisha Idhini"
                          >
                            <XCircle size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => approveMutation.mutate({ id: vendor.id, approved: true })}
                            className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-100 transition-all"
                            title="Thibitisha Muuzaji"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!vendors || vendors.length === 0) && (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Store size={40} />
                </div>
                <p className="text-[#6B7280] font-black uppercase tracking-widest">Hakuna wauzaji waliopatikana.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
