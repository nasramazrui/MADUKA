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

import { useVendorProducts, useVendorStats, useVendorOrders } from '@/hooks/useVendor';

export default function VendorDashboard() {
  const { user } = useAuth();
  const businessType = user?.businessType || 'SHOP';
  
  const { data: productsData } = useVendorProducts({ limit: 3 });
  const { data: statsData } = useVendorStats();
  const { data: recentOrdersData } = useVendorOrders(undefined, 4);
  
  const stats = [
    { name: 'Total Revenue', value: statsData ? `TZS ${statsData.totalRevenue.toLocaleString()}` : 'TZS 0', change: '+0%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Orders', value: statsData?.totalOrders.toString() || '0', change: '+0%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Products', value: statsData?.activeProducts.toString() || '0', change: '+0%', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Avg. Rating', value: statsData?.avgRating.toFixed(1) || '0.0', change: '0.0', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const getLabels = () => {
    switch(businessType) {
      case 'TAXI':
      case 'CAR_RENTAL':
        return { welcome: 'Here\'s what\'s happening with your fleet today.', items: 'Popular Vehicles', addBtn: 'Add New Vehicle' };
      case 'HOTEL':
        return { welcome: 'Here\'s what\'s happening with your hotel today.', items: 'Popular Rooms', addBtn: 'Add New Room' };
      default:
        return { welcome: 'Here\'s what\'s happening with your store today.', items: 'Popular Products', addBtn: 'Add New Product' };
    }
  };

  const labels = getLabels();

  return (
    <VendorLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">Dashboard</h1>
            <p className="text-text-secondary font-medium">{labels.welcome}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-secondary hover:bg-gray-50 transition-colors">
              Download Report
            </button>
            <Link 
              to="/vendor/products"
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center"
            >
              {labels.addBtn}
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
              className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                  {stat.change}
                  {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-sm font-bold text-text-secondary mb-1">{stat.name}</p>
              <h3 className="text-2xl font-black text-secondary">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-secondary">Revenue Overview</h3>
              <select className="bg-gray-50 border border-border rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
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
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
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

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-black text-secondary mb-6">Recent Orders</h3>
            <div className="space-y-6">
              {recentOrdersData?.length > 0 ? (
                recentOrdersData.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'PLACED' ? 'bg-orange-100 text-orange-600' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {order.status === 'PLACED' ? <Clock size={18} /> : 
                         order.status === 'CONFIRMED' ? <AlertCircle size={18} /> : 
                         <CheckCircle2 size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">{order.customer?.name}</p>
                        <p className="text-xs text-text-secondary font-medium">#{order.id.slice(-6).toUpperCase()} • {order.items?.length || 0} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">TZS {order.total.toLocaleString()}</p>
                      <p className="text-[10px] text-text-secondary font-bold">{format(new Date(order.createdAt), 'HH:mm')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-text-secondary font-bold">No recent orders.</p>
                </div>
              )}
            </div>
            <Link to="/vendor/orders" className="block w-full mt-8 py-3 bg-gray-50 text-secondary text-center font-bold rounded-xl hover:bg-gray-100 transition-colors">
              View All Orders
            </Link>
          </div>
        </div>

        {/* Quick Actions / Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-secondary text-white p-8 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Ready to Payout?</h3>
              <p className="text-white/60 mb-6 max-w-xs">You have TZS 450,000 available for withdrawal to your bank or mobile money.</p>
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
                Withdraw Funds
              </button>
            </div>
            <Wallet size={140} className="absolute right-[-20px] bottom-[-20px] text-white/5" />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-secondary">{labels.items}</h3>
              <button className="text-primary text-sm font-bold">Manage Inventory</button>
            </div>
            <div className="space-y-4">
              {productsData?.products?.length > 0 ? (
                productsData.products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-border overflow-hidden">
                        <img src={product.images?.[0] || `https://picsum.photos/seed/${product.name}/100/100`} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary line-clamp-1">{product.name}</p>
                        <p className="text-xs text-text-secondary font-medium">0 sales this week</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-secondary">TZS {product.price.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold ${product.stockQty < 10 ? 'text-danger' : 'text-success'}`}>
                        {product.stockQty} in stock
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-text-secondary font-bold">No {labels.items.toLowerCase()} yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
