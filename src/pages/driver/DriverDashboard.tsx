import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  Star, 
  Zap, 
  Car, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const MOCK_CHART_DATA = [
  { hour: '08:00', taxi: 12000, rental: 0 },
  { hour: '10:00', taxi: 8500, rental: 0 },
  { hour: '12:00', taxi: 15000, rental: 50000 },
  { hour: '14:00', taxi: 9000, rental: 0 },
  { hour: '16:00', taxi: 22000, rental: 0 },
  { hour: '18:00', taxi: 18000, rental: 0 },
  { hour: '20:00', taxi: 14000, rental: 0 },
];

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);

  // Mock active request for demo
  const simulateRequest = () => {
    setActiveRequest({
      id: 'REQ-123',
      customer: 'Amina Hassan',
      pickup: 'Mlimani City Mall',
      dropoff: 'Julius Nyerere Airport',
      distance: '14.2 km',
      fare: '12,500',
      timeLeft: 30
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-[32px] border-4 transition-all ${
          isOnline ? 'bg-green-500 border-green-400/50 text-white' : 'bg-gray-100 border-gray-200 text-gray-500'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
              isOnline ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {isOnline ? '🟢' : '⚫'}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {isOnline ? 'Uko Online' : 'Uko Offline'}
              </h2>
              <p className={`text-sm font-bold ${isOnline ? 'text-white/80' : 'text-gray-400'}`}>
                {isOnline ? 'Unaweza kupokea safari na booking' : 'Washa ili kuanza kupokea kazi'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none text-center md:text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Umekuwa online</p>
              <p className="text-xl font-black">2 saa 34 dakika</p>
            </div>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`h-16 px-10 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl ${
                isOnline 
                  ? 'bg-white text-green-600 hover:bg-gray-100' 
                  : 'bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90'
              }`}
            >
              {isOnline ? 'WASHWA' : 'WASHA'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Mapato Leo', value: 'TZS 45,000', trend: '+18% jana', icon: TrendingUp, color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10' },
          { label: 'Safari Leo', value: '6 safari', trend: '4 taxi + 2 rental', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-600/10' },
          { label: 'Rating Wangu', value: '4.8 / 5.0', trend: 'Maoni 234', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Online Saa', value: '6.5 saa', trend: 'Saa bora: 14:00', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-[#1A1A2E]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Active Request Alert */}
      {activeRequest && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[32px] border-4 border-[#FF6B35] shadow-2xl shadow-[#FF6B35]/20 overflow-hidden relative"
        >
          <div className="bg-[#FF6B35] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Zap className="animate-pulse" size={24} />
              <h3 className="font-black uppercase tracking-wider">Safari Mpya Imeombiwa!</h3>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full font-black text-xs">
              00:{activeRequest.timeLeft < 10 ? `0${activeRequest.timeLeft}` : activeRequest.timeLeft}
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">👤</div>
                  <div>
                    <h4 className="text-xl font-black text-[#1A1A2E]">{activeRequest.customer}</h4>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">4.9</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="w-0.5 h-8 bg-gray-200 border-dashed border-l" />
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Pickup</p>
                        <p className="font-bold text-[#1A1A2E]">{activeRequest.pickup}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Dropoff</p>
                        <p className="font-bold text-[#1A1A2E]">{activeRequest.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[240px] space-y-4">
                <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E5E7EB] text-center">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Bei ya Safari</p>
                  <p className="text-3xl font-black text-[#FF6B35]">TZS {activeRequest.fare}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-2">Umbali: {activeRequest.distance}</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setActiveRequest(null)}
                    variant="outline" 
                    className="flex-1 h-14 rounded-xl font-black text-red-500 border-red-100 hover:bg-red-50"
                  >
                    Kataa
                  </Button>
                  <Button className="flex-1 h-14 rounded-xl font-black bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20">
                    KUBALI
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <motion.div 
            className="absolute bottom-0 left-0 h-1.5 bg-[#FF6B35]"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 30, ease: 'linear' }}
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-[#1A1A2E]">Mapato ya Leo</h3>
              <p className="text-sm font-bold text-[#6B7280]">Mchanganuo wa saa kwa saa</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                <span className="text-[10px] font-black text-[#6B7280] uppercase">Taxi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-[10px] font-black text-[#6B7280] uppercase">Rental</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Bar dataKey="taxi" stackId="a" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="rental" stackId="a" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[32px] border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-[#1A1A2E]">Safari za Karibuni</h3>
            <button className="text-xs font-black text-[#FF6B35] uppercase hover:underline">Zote</button>
          </div>
          
          <div className="space-y-6">
            {[
              { name: 'Amina H.', route: 'Mlimani → Airport', amount: '12,500', time: 'Muda mrefu uliopita', type: 'TAXI' },
              { name: 'David M.', route: 'Rental (Siku 3)', amount: '150,000', time: 'Jana 14:00', type: 'RENTAL' },
              { name: 'John D.', route: 'Posta → Mwenge', amount: '8,000', time: 'Jana 09:30', type: 'TAXI' },
            ].map((trip, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                  trip.type === 'TAXI' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'bg-purple-100 text-purple-600'
                }`}>
                  {trip.type === 'TAXI' ? '🚕' : '🚗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black text-[#1A1A2E] truncate">{trip.name}</h4>
                    <span className="text-sm font-black text-[#1A1A2E]">TZS {trip.amount}</span>
                  </div>
                  <p className="text-[10px] font-bold text-[#6B7280] truncate">{trip.route}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-1">{trip.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={simulateRequest}
            className="w-full mt-8 h-12 rounded-xl bg-[#1A1A2E] text-white font-black text-xs uppercase tracking-widest"
          >
            Simulate Request
          </Button>
        </div>
      </div>
    </div>
  );
}
