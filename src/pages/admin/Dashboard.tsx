import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Globe,
  Smartphone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminStats, usePendingVerifications } from '@/hooks/useAdmin';

const platformData = [
  { name: 'Jan', revenue: 45000, users: 1200 },
  { name: 'Feb', revenue: 52000, users: 1500 },
  { name: 'Mar', revenue: 48000, users: 1800 },
  { name: 'Apr', revenue: 61000, users: 2200 },
  { name: 'May', revenue: 55000, users: 2600 },
  { name: 'Jun', revenue: 67000, users: 3100 },
];

const moduleDistribution = [
  { name: 'Food', value: 45, color: '#FF6B35' },
  { name: 'Grocery', value: 25, color: '#10B981' },
  { name: 'Taxi', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 15, color: '#6366F1' },
];

const stats = [
  { name: 'Platform Revenue', value: 'TZS 142.5M', change: '+18.2%', icon: DollarSign, color: 'text-primary', bg: 'bg-orange-50' },
  { name: 'Total Users', value: '12,842', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Active Vendors', value: '452', change: '+5.4%', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'App Installs', value: '45.2K', change: '+22.1%', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const verificationQueue = [
  { id: '#V-9281', name: 'Mamboz BBQ', type: 'Vendor', date: '2024-04-11', status: 'Pending' },
  { id: '#P-1022', name: 'TZS 450,000', type: 'Payment', date: '2024-04-11', status: 'Awaiting' },
  { id: '#V-9280', name: 'Kariakoo Market', type: 'Vendor', date: '2024-04-10', status: 'Reviewing' },
];

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: queueData, isLoading: queueLoading } = usePendingVerifications();

  const stats = [
    { name: 'Platform Revenue', value: statsData ? `TZS ${statsData.totalRevenue.toLocaleString()}` : 'TZS 0', change: '+0%', icon: DollarSign, color: 'text-primary', bg: 'bg-orange-50' },
    { name: 'Total Users', value: statsData?.totalUsers.toLocaleString() || '0', change: '+0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Vendors', value: statsData?.totalVendors.toLocaleString() || '0', change: '+0%', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Active Drivers', value: statsData?.totalDrivers.toLocaleString() || '0', change: '+0%', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const verificationQueue = [
    ...(queueData?.vendors || []).map((v: any) => ({ id: v.id, name: v.businessName, type: 'Vendor', date: new Date(v.createdAt).toLocaleDateString(), status: 'Pending' })),
    ...(queueData?.drivers || []).map((d: any) => ({ id: d.id, name: d.user?.name, type: 'Driver', date: new Date(d.createdAt).toLocaleDateString(), status: 'Pending' })),
  ].slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight">System Overview</h1>
            <p className="text-gray-500 font-medium mt-1">Real-time platform performance and operational metrics.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#1A1A2E]">Server: TZ-WEST-1 (Active)</span>
            </div>
            <button className="px-6 py-3 bg-[#1A1A2E] text-white rounded-2xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:bg-gray-800 transition-all">
              System Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-3xl font-black text-[#1A1A2E]">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-[#1A1A2E]">Revenue & Growth</h3>
                <p className="text-sm text-gray-400 font-medium">Monthly performance across all modules</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 text-[#1A1A2E] rounded-xl text-xs font-bold border border-gray-200">Revenue</button>
                <button className="px-4 py-2 bg-white text-gray-400 rounded-xl text-xs font-bold border border-transparent">Users</button>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF6B35" 
                    strokeWidth={5}
                    dot={{ r: 6, fill: '#FF6B35', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-2xl font-black text-[#1A1A2E] mb-2">Module Usage</h3>
            <p className="text-sm text-gray-400 font-medium mb-10">Distribution of orders by category</p>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moduleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {moduleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full mt-10">
                {moduleDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-gray-500">{item.name}</span>
                    <span className="text-sm font-black text-[#1A1A2E] ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Queue & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#1A1A2E]">Verification Queue</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All Queue</button>
            </div>
            <div className="space-y-4">
              {verificationQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      item.type === 'Vendor' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-primary'
                    }`}>
                      {item.type === 'Vendor' ? <Store size={24} /> : <DollarSign size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-[#1A1A2E] group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{item.id} • {item.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400 font-bold">{item.date}</p>
                      <p className="text-sm font-black text-[#1A1A2E]">{item.status}</p>
                    </div>
                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A2E] p-10 rounded-[40px] text-white relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-black">Security Audit</h3>
              </div>
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <p className="text-sm font-medium text-gray-300">All payment gateways are operational</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <p className="text-sm font-medium text-gray-300">No suspicious login attempts detected</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium text-orange-200">2 vendors awaiting document verification</p>
                </div>
              </div>
              <button className="mt-10 w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
                Run Full System Audit
              </button>
            </div>
            <Globe size={200} className="absolute right-[-50px] bottom-[-50px] text-white/5" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
