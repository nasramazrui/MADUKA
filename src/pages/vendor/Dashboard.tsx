import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Wallet,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import VendorLayout from '@/components/vendor/VendorLayout';
import { useAuth } from '@/hooks/useAuth';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 25 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

const stats = [
  { name: 'Total Revenue', value: 'TZS 2.4M', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Total Orders', value: '154', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Active Customers', value: '842', change: '+5.4%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Avg. Order Value', value: 'TZS 15.5K', change: '-2.1%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const recentOrders = [
  { id: '#ORD-7281', customer: 'Amani Juma', items: 3, total: 'TZS 45,000', status: 'Pending', time: '5 mins ago' },
  { id: '#ORD-7280', customer: 'Sarah M.', items: 1, total: 'TZS 12,500', status: 'Processing', time: '12 mins ago' },
  { id: '#ORD-7279', customer: 'David K.', items: 5, total: 'TZS 89,000', status: 'Delivered', time: '45 mins ago' },
  { id: '#ORD-7278', customer: 'Grace L.', items: 2, total: 'TZS 32,000', status: 'Delivered', time: '1 hour ago' },
];

import { useVendorProducts, useVendorStats, useVendorOrders, useVendorPrescriptions } from '@/hooks/useVendor';

export default function VendorDashboard() {
  const { user } = useAuth();
  const businessType = user?.vendor?.businessType || 'SHOP';
  const isWholesaler = user?.vendor?.isWholesaler || false;
  
  const { data: productsData } = useVendorProducts({ limit: 4 });
  const { data: statsData } = useVendorStats();
  const { data: recentOrdersData } = useVendorOrders(undefined, 4);
  const { data: prescriptionsData } = useVendorPrescriptions();
  
  const stats = [
    { name: 'Mauzo ya Leo', value: statsData ? `TZS ${statsData.todayRevenue?.toLocaleString() || '0'}` : 'TZS 0', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Oda Mpya', value: statsData?.newOrders?.toString() || '0', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', badge: statsData?.newOrders || 0 },
    { name: 'Jumla ya Mauzo', value: statsData ? `TZS ${statsData.totalRevenue?.toLocaleString() || '0'}` : 'TZS 0', change: '+5.4%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { 
      name: businessType === 'PHARMACY' ? 'Dawa Zinazoisha Muda' : 'Bidhaa Zinazokaribia Kuisha', 
      value: statsData?.lowStockCount?.toString() || '0', 
      change: 'Alert', 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      isAlert: (statsData?.lowStockCount || 0) > 0 
    },
  ];

  return (
    <VendorLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">
              KARIBU, {user?.name?.split(' ')[0].toUpperCase()}!
            </h1>
            <p className="text-[#6B7280] font-bold">Hapa ndivyo biashara yako inavyoendelea leo.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/vendor/products/new"
              className="px-6 py-3 bg-[#FF6B35] text-white rounded-xl text-sm font-black shadow-lg shadow-[#FF6B35]/20 hover:bg-[#FF6B35]/90 transition-all flex items-center gap-2"
            >
              <Package size={18} />
              Ongeza Bidhaa Mpya
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                {stat.badge ? (
                  <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2 py-1 rounded-full">
                    {stat.badge} MPYA
                  </span>
                ) : (
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.isAlert ? 'text-red-500' : 'text-green-500'}`}>
                    {stat.change}
                    {!stat.isAlert && <TrendingUp size={14} />}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-wider mb-1">{stat.name}</p>
              <h3 className="text-2xl font-black text-[#1A1A2E]">{stat.value}</h3>
              {stat.isAlert && (
                <div className="absolute top-0 right-0 w-1 h-full bg-red-500" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight">Grafu ya Mauzo</h3>
              <select className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20">
                <option>Ya Wiki Hii</option>
                <option>Ya Mwezi Huu</option>
                <option>Ya Mwaka</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#FF6B35" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
            <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight mb-6">Bidhaa Zinazouzika Zaidi</h3>
            <div className="space-y-6">
              {productsData?.products?.length > 0 ? (
                productsData.products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] overflow-hidden">
                        <img 
                          src={product.images?.[0] || `https://picsum.photos/seed/${product.name}/100/100`} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#6B7280] font-bold">TSH {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#1A1A2E]">120 Pcs</p>
                      <p className="text-[10px] text-green-500 font-black uppercase">Inauzika Sana</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[#6B7280] font-black">Bado huna bidhaa.</p>
                </div>
              )}
            </div>
            <Link to="/vendor/products" className="block w-full mt-8 py-4 bg-[#F8F9FA] text-[#1A1A2E] text-center font-black rounded-2xl hover:bg-[#E5E7EB] transition-all uppercase text-xs tracking-widest">
              Angalia Bidhaa Zote
            </Link>
          </div>
        </div>

        {/* Pharmacy Specific: Prescriptions */}
        {businessType === 'PHARMACY' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight">Vyeti vya Dawa (Prescriptions)</h3>
              <Link to="/vendor/prescriptions" className="text-[#FF6B35] font-black text-sm hover:underline">
                Angalia Zote
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {prescriptionsData?.slice(0, 4).map((prescription: any) => (
                <div key={prescription.id} className="bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] overflow-hidden group">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={prescription.imageUrl} 
                      alt="Prescription" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        prescription.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                        prescription.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black text-[#1A1A2E]">{prescription.customer.name}</p>
                    <p className="text-[10px] text-[#6B7280] font-bold">{format(new Date(prescription.createdAt), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
              ))}
              {(!prescriptionsData || prescriptionsData.length === 0) && (
                <div className="col-span-full py-12 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E5E7EB]">
                  <p className="text-[#6B7280] font-black">Hakuna vyeti vipya vya dawa.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wholesale Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tight">Mfumo wa Bei za Jumla & Rejareja</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isWholesaler ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                {isWholesaler ? 'Duka la Jumla' : 'Duka la Kawaida'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {productsData?.products?.slice(0, 2).map((product: any) => (
              <div key={product.id} className="p-6 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
                  <img 
                    src={product.images?.[0] || `https://picsum.photos/seed/${product.name}/200/200`} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-black text-[#1A1A2E] text-lg">{product.name}</h4>
                    <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Kiasi cha chini cha oda (Jumla): {product.minOrderQty || 12} Pcs</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-[#E5E7EB]">
                      <p className="text-[10px] font-black text-[#6B7280] uppercase mb-1">Bei ya Rejareja:</p>
                      <p className="text-lg font-black text-[#1A1A2E]">TSH {product.price.toLocaleString()}</p>
                    </div>
                    
                    {isWholesaler ? (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Bei ya Jumla (Max):</p>
                        <p className="text-lg font-black text-blue-700">TSH {(product.price * 0.8).toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 opacity-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Bei ya Jumla:</p>
                        <p className="text-sm font-bold text-gray-400 italic">Haikupatikana</p>
                      </div>
                    )}
                  </div>
                  
                  {isWholesaler && (
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-[#FF6B35] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-[#FF6B35]/20">
                        Omba Nukuu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
