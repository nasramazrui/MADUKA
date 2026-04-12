import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Search, Filter, MoreHorizontal, Eye, Loader2 } from 'lucide-react';
import { useVendorOrders, useUpdateOrderStatus } from '@/hooks/useVendor';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function VendorOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { data: orders, isLoading } = useVendorOrders(statusFilter === 'All' ? undefined : statusFilter.toUpperCase());
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
  };

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">Orders</h1>
            <p className="text-text-secondary font-medium">Manage and track your customer orders.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-secondary hover:bg-gray-50">
              <Filter size={18} /> Filter
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search order ID or customer..." 
                className="w-full h-10 bg-white border border-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {['All', 'Placed', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === tab ? 'bg-secondary text-white' : 'text-text-secondary hover:bg-gray-100'
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
              <p className="text-text-secondary font-bold">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-text-secondary text-[10px] font-black uppercase tracking-widest border-b border-border">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence mode="popLayout">
                    {orders?.map((order: any) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-secondary text-sm">#{order.id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-secondary text-sm">{order.customer?.name}</p>
                          <p className="text-xs text-text-secondary">{order.customer?.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                        </td>
                        <td className="px-6 py-4 font-black text-secondary text-sm">TZS {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter outline-none cursor-pointer ${
                              order.status === 'PLACED' ? 'bg-orange-100 text-orange-600' :
                              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-600' :
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                              'bg-red-100 text-red-600'
                            }`}
                          >
                            <option value="PLACED">Placed</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-text-secondary hover:text-secondary transition-colors">
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
                <div className="py-20 text-center">
                  <p className="text-text-secondary font-bold">No orders found.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="p-6 border-t border-border flex items-center justify-between bg-gray-50/30">
            <p className="text-xs font-bold text-text-secondary">Showing {orders?.length || 0} orders</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50" disabled>Previous</button>
              <button className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-bold text-secondary">Next</button>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
