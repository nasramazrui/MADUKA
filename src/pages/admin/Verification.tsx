import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, CheckCircle2, XCircle, Clock, Eye, ShieldAlert, Loader2 } from 'lucide-react';
import { usePendingVerifications, useVerifyVendor, useVerifyDriver } from '@/hooks/useAdmin';
import { toast } from 'sonner';

export default function AdminVerification() {
  const [filter, setFilter] = useState('All');
  const { data: queueData, isLoading } = usePendingVerifications();
  const verifyVendor = useVerifyVendor();
  const verifyDriver = useVerifyDriver();

  const vendors = (queueData?.vendors || []).map((v: any) => ({ 
    id: v.id, 
    name: v.businessName, 
    type: 'Vendor', 
    date: new Date(v.createdAt).toLocaleDateString(), 
    status: 'Pending', 
    risk: 'Low' 
  }));

  const drivers = (queueData?.drivers || []).map((d: any) => ({ 
    id: d.id, 
    name: d.user?.name, 
    type: 'Driver', 
    date: new Date(d.createdAt).toLocaleDateString(), 
    status: 'Pending', 
    risk: 'Low' 
  }));

  const queue = [...vendors, ...drivers].filter(item => 
    filter === 'All' || item.type === filter.slice(0, -1)
  );

  const handleVerify = async (item: any, status: 'APPROVED' | 'REJECTED') => {
    try {
      if (item.type === 'Vendor') {
        await verifyVendor.mutateAsync({ id: item.id, status });
      } else {
        await verifyDriver.mutateAsync({ id: item.id, status });
      }
      toast.success(`${item.type} ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} ${item.type.toLowerCase()}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight">Verification Queue</h1>
            <p className="text-gray-500 font-medium mt-1">Review and approve vendors, drivers, and large payments.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#1A1A2E] hover:bg-gray-50 shadow-sm">
              <Filter size={20} /> Filter Queue
            </button>
            <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20">
              Bulk Actions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by ID, name or type..." 
                className="w-full h-12 bg-white border border-gray-200 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="flex gap-3">
              {['All', 'Vendors', 'Drivers'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                    filter === tab ? 'bg-[#1A1A2E] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-gray-400 font-bold">Loading queue...</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                    <th className="px-10 py-6">Reference</th>
                    <th className="px-10 py-6">Entity / Amount</th>
                    <th className="px-10 py-6">Type</th>
                    <th className="px-10 py-6">Date Submitted</th>
                    <th className="px-10 py-6">Risk Level</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {queue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-10 py-6 font-black text-[#1A1A2E]">{item.id}</td>
                      <td className="px-10 py-6 font-bold text-gray-600">{item.name}</td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          item.type === 'Vendor' ? 'bg-blue-50 text-blue-600' :
                          item.type === 'Driver' ? 'bg-purple-50 text-purple-600' :
                          'bg-orange-50 text-primary'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-sm font-bold text-gray-400">{item.date}</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className={
                            item.risk === 'High' ? 'text-danger' :
                            item.risk === 'Medium' ? 'text-warning' :
                            'text-success'
                          } />
                          <span className={`text-xs font-black ${
                            item.risk === 'High' ? 'text-danger' :
                            item.risk === 'Medium' ? 'text-warning' :
                            'text-success'
                          }`}>{item.risk}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-warning" />
                          <span className="text-xs font-black text-[#1A1A2E]">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleVerify(item, 'APPROVED')}
                            disabled={verifyVendor.isPending || verifyDriver.isPending}
                            className="p-3 bg-green-50 text-success rounded-xl hover:bg-success hover:text-white transition-all shadow-sm disabled:opacity-50"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            onClick={() => handleVerify(item, 'REJECTED')}
                            disabled={verifyVendor.isPending || verifyDriver.isPending}
                            className="p-3 bg-red-50 text-danger rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm disabled:opacity-50"
                          >
                            <XCircle size={20} />
                          </button>
                          <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#1A1A2E] hover:text-white transition-all shadow-sm">
                            <Eye size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="p-10 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Showing {queue.length} items in queue</p>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-400 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#1A1A2E] hover:bg-gray-100 transition-all">Next Page</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
