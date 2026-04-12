import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  Eye, 
  Bike, 
  Car, 
  Zap, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Download,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminDriversPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['admin-drivers', filter],
    queryFn: async () => {
      const response = await api.get(`/admin/drivers?status=${filter}`);
      return response.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/admin/drivers/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast.success('Dereva amekubaliwa!');
      setSelectedDriver(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      await api.post(`/admin/drivers/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast.success('Maombi yamekataliwa');
      setSelectedDriver(null);
    }
  });

  const filteredDrivers = drivers?.filter((d: any) => 
    d.user.name.toLowerCase().includes(search.toLowerCase()) ||
    d.vehiclePlate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A2E]">Usimamizi wa Madereva</h1>
          <p className="text-[#6B7280] font-bold">Hakiki, dhibiti na angalia utendaji wa madereva</p>
        </div>
        <Button className="h-12 bg-[#1A1A2E] text-white rounded-xl font-black px-6">
          <Plus size={20} className="mr-2" /> Ongeza Dereva
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Madereva Wote', value: drivers?.length || 0, color: 'text-[#1A1A2E]', bg: 'bg-gray-100' },
          { label: 'Wanasubiri (Pending)', value: drivers?.filter((d: any) => !d.isApproved).length || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Wako Online', value: 12, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Safari za Leo', value: 145, color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/5' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[24px] ${stat.bg} border border-black/5`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[24px] border border-[#E5E7EB] flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
          <Input 
            placeholder="Tafuta kwa jina au namba ya gari..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-12 pl-12 rounded-xl border-none bg-[#F8F9FA] font-bold"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 h-12 rounded-xl text-xs font-black transition-all ${
                filter === f 
                  ? 'bg-[#1A1A2E] text-white shadow-lg' 
                  : 'bg-[#F8F9FA] text-[#6B7280] hover:bg-gray-100'
              }`}
            >
              {f === 'ALL' ? 'Wote' : f === 'PENDING' ? 'Wanasubiri' : f === 'APPROVED' ? 'Waliokubaliwa' : 'Waliokataliwa'}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-[32px] border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Dereva</th>
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Gari</th>
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Huduma</th>
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Hali (Status)</th>
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Rating</th>
                <th className="p-6 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-[#1A1A2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-black text-[#6B7280]">Inapakia madereva...</p>
                  </td>
                </tr>
              ) : filteredDrivers?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Bike size={32} />
                    </div>
                    <p className="font-black text-[#6B7280]">Hakuna dereva aliyepatikana</p>
                  </td>
                </tr>
              ) : filteredDrivers?.map((driver: any) => (
                <tr key={driver.id} className="hover:bg-[#F8F9FA] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-lg">
                        {driver.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#1A1A2E]">{driver.user.name}</p>
                        <p className="text-[10px] font-bold text-[#6B7280]">{driver.user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                        {driver.vehicleType === 'CAR' ? <Car size={20} /> : <Bike size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-[#1A1A2E] uppercase">{driver.vehiclePlate}</p>
                        <p className="text-[10px] font-bold text-[#6B7280]">{driver.vehicleMake} {driver.vehicleModel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      {driver.offersTaxi && <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center" title="Taxi"><Zap size={16} /></div>}
                      {driver.offersRental && <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center" title="Rental"><Car size={16} /></div>}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      driver.isApproved 
                        ? 'bg-green-100 text-green-600' 
                        : driver.rejectionReason 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-amber-100 text-amber-600'
                    }`}>
                      {driver.isApproved ? 'Approved' : driver.rejectionReason ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">{driver.avgRating || '5.0'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedDriver(driver)}
                        className="h-9 rounded-lg font-bold border-[#E5E7EB] hover:bg-white"
                      >
                        <Eye size={16} className="mr-2" /> View
                      </Button>
                      {!driver.isApproved && !driver.rejectionReason && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => approveMutation.mutate(driver.id)}
                            className="h-9 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const reason = window.prompt('Sababu ya kukataa:');
                              if (reason) rejectMutation.mutate({ id: driver.id, reason });
                            }}
                            className="h-9 rounded-lg font-bold border-red-100 text-red-500 hover:bg-red-50"
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Detail Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDriver(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8F9FA]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E] flex items-center justify-center text-white text-2xl font-black">
                    {selectedDriver.user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A2E]">{selectedDriver.user.name}</h2>
                    <p className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Driver ID: {selectedDriver.id.slice(-8)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDriver(null)} className="p-2 hover:bg-white rounded-xl text-[#6B7280]">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Personal & Vehicle */}
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] border-b pb-2">Mawasiliano</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-bold text-[#1A1A2E]">
                          <Phone size={16} className="text-[#FF6B35]" /> {selectedDriver.user.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-[#1A1A2E]">
                          <Mail size={16} className="text-[#FF6B35]" /> {selectedDriver.user.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-[#1A1A2E]">
                          <MapPin size={16} className="text-[#FF6B35]" /> {selectedDriver.region}, {selectedDriver.district}
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] border-b pb-2">Gari</h3>
                      <div className="bg-[#F8F9FA] p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#6B7280]">Plate</span>
                          <span className="text-sm font-black text-[#1A1A2E] uppercase">{selectedDriver.vehiclePlate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#6B7280]">Make/Model</span>
                          <span className="text-sm font-black text-[#1A1A2E]">{selectedDriver.vehicleMake} {selectedDriver.vehicleModel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#6B7280]">Rangi</span>
                          <span className="text-sm font-black text-[#1A1A2E]">{selectedDriver.vehicleColor}</span>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Middle Column: Documents */}
                  <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] border-b pb-2">Nyaraka za Uhalali</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Leseni ya Udereva', expiry: selectedDriver.licenseExpiry },
                          { label: 'Insurance ya Gari', expiry: selectedDriver.insuranceExpiry },
                          { label: 'Kadi ya Gari (Logbook)', expiry: 'N/A' },
                          { label: 'Namba ya NIDA', value: selectedDriver.nidaNumber },
                        ].map((doc, i) => (
                          <div key={i} className="p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#1A1A2E] transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                              <FileText size={20} className="text-[#6B7280] group-hover:text-[#1A1A2E]" />
                              <Download size={16} className="text-[#6B7280] opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-xs font-black text-[#1A1A2E]">{doc.label}</p>
                            <p className="text-[10px] font-bold text-[#6B7280] mt-1">
                              {doc.expiry ? `Inaisha: ${doc.expiry}` : doc.value || 'Imehakikiwa'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] border-b pb-2">Picha za Gari</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-[#E5E7EB]">
                            <img src={`https://picsum.photos/seed/car${i}/400/300`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                    selectedDriver.isApproved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    Hali: {selectedDriver.isApproved ? 'Approved' : 'Pending Review'}
                  </div>
                </div>
                <div className="flex gap-3">
                  {!selectedDriver.isApproved && (
                    <>
                      <Button 
                        onClick={() => {
                          const reason = window.prompt('Sababu ya kukataa:');
                          if (reason) rejectMutation.mutate({ id: selectedDriver.id, reason });
                        }}
                        variant="outline" 
                        className="h-12 px-8 rounded-xl font-black text-red-500 border-red-100 hover:bg-red-50"
                      >
                        Kataa Maombi
                      </Button>
                      <Button 
                        onClick={() => approveMutation.mutate(selectedDriver.id)}
                        className="h-12 px-8 rounded-xl font-black bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                      >
                        Kubali Dereva
                      </Button>
                    </>
                  )}
                  {selectedDriver.isApproved && (
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-red-500 border-red-100">
                      Sitisha Akaunti
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
