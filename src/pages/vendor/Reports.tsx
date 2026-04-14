import React from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Download, Calendar } from 'lucide-react';
import { useVendorStats } from '@/hooks/useVendor';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#FF6B35', '#1A1A2E', '#4ECDC4', '#FFD93D', '#6B7280'];

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const categoryData = [
  { name: 'Elektroniki', value: 400 },
  { name: 'Chakula', value: 300 },
  { name: 'Mavazi', value: 300 },
  { name: 'Vifaa vya Nyumbani', value: 200 },
];

export default function VendorReports() {
  const { data: statsData, isLoading } = useVendorStats();

  const reportStats = [
    { name: 'Jumla ya Mapato', value: `TSH ${statsData?.totalRevenue?.toLocaleString() || 0}`, change: '+15.2%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Wastani wa Oda', value: `TSH ${statsData?.avgOrderValue?.toLocaleString() || 0}`, change: '+5.4%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Idadi ya Oda', value: statsData?.totalOrders?.toString() || '0', change: '+12.1%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Bidhaa Zinazouzika', value: '85%', change: '+2.3%', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Ripoti za Mauzo</h1>
            <p className="text-[#6B7280] font-bold">Uchambuzi wa kina wa biashara yako.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-black text-[#1A1A2E] hover:bg-gray-50 transition-all uppercase tracking-widest">
              <Calendar size={18} /> Chagua Tarehe
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-2xl text-sm font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest">
              <Download size={18} /> Pakua Ripoti ya PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((stat, i) => (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                  {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-wider mb-1">{stat.name}</p>
              <h3 className="text-xl font-black text-[#1A1A2E]">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Sales Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm">
            <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-8">Mwenendo wa Mauzo</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800 }}
                    cursor={{ fill: '#F8F9FA' }}
                  />
                  <Bar dataKey="sales" fill="#FF6B35" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm">
            <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-8">Mauzo kwa Makundi</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-3">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-bold text-[#6B7280]">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-[#1A1A2E]">{item.value} Oda</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="bg-white rounded-[32px] border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/30">
            <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight">Bidhaa Zinazouzika Zaidi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8F9FA] text-[#6B7280] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#E5E7EB]">
                  <th className="px-8 py-5">Bidhaa</th>
                  <th className="px-8 py-5">Idadi Iliyouzwa</th>
                  <th className="px-8 py-5">Mapato</th>
                  <th className="px-8 py-5">Hali ya Stoo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-[#E5E7EB] overflow-hidden">
                          <img src={`https://picsum.photos/seed/prod${i}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="font-black text-[#1A1A2E]">Bidhaa ya Mfano #{i}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#6B7280]">150 Pcs</td>
                    <td className="px-8 py-6 font-black text-[#1A1A2E]">TSH 750,000</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Inatosha</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
