import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { motion } from 'motion/react';

export default function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 sm:p-8 font-sans overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      {/* Responsive Container */}
      <div className="relative w-full h-screen sm:h-[844px] sm:max-w-[390px] bg-white sm:rounded-[55px] shadow-[0_0_0_12px_#1E293B,0_0_0_14px_#334155,0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden border-[1px] border-white/5 transition-all duration-500">
        
        {/* Dynamic Island - Only visible on simulated mobile (sm and up) */}
        <motion.div 
          initial={{ width: 120 }}
          animate={{ width: 126 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 h-8 bg-black rounded-[20px] z-[100] items-center justify-center gap-3 px-4 shadow-lg"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="w-16 h-1 bg-white/10 rounded-full" />
        </motion.div>

        {/* Status Bar Simulation */}
        <div className="absolute top-0 left-0 right-0 h-14 px-8 flex items-center justify-between z-[90] text-secondary pointer-events-none">
          <span className="text-[14px] font-black tracking-tight">9:41</span>
          <div className="flex items-center gap-2">
            <Signal size={16} strokeWidth={2.5} />
            <Wifi size={16} strokeWidth={2.5} />
            <div className="relative w-7 h-3.5 border-2 border-secondary/30 rounded-[4px] flex items-center px-[1px]">
              <div className="h-full bg-secondary rounded-[1px] w-[80%]" />
              <div className="absolute right-[-4px] w-1 h-1.5 bg-secondary/30 rounded-r-sm" />
            </div>
          </div>
        </div>
        
        {/* Content Container */}
        <div className="h-full w-full overflow-hidden bg-[#F8F9FA] relative">
          {children}
          
          {/* Screen Reflection Overlay - Only on simulated mobile */}
          <div className="hidden sm:block absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10 z-50" />
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 rounded-full z-[100] backdrop-blur-md"></div>
        
        {/* Side Buttons Simulation - Only on simulated mobile */}
        <div className="hidden sm:block">
          {/* Silent Switch */}
          <div className="absolute left-[-14px] top-28 w-[4px] h-8 bg-[#334155] rounded-l-md shadow-[-2px_0_5px_rgba(0,0,0,0.5)]"></div>
          {/* Volume Up */}
          <div className="absolute left-[-14px] top-44 w-[4px] h-16 bg-[#334155] rounded-l-md shadow-[-2px_0_5px_rgba(0,0,0,0.5)]"></div>
          {/* Volume Down */}
          <div className="absolute left-[-14px] top-64 w-[4px] h-16 bg-[#334155] rounded-l-md shadow-[-2px_0_5px_rgba(0,0,0,0.5)]"></div>
          {/* Power Button */}
          <div className="absolute right-[-14px] top-48 w-[4px] h-24 bg-[#334155] rounded-r-md shadow-[2px_0_5px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>

      {/* Device Label - Only on desktop */}
      <div className="hidden lg:block absolute bottom-8 text-white/20 font-black uppercase tracking-[0.5em] text-[10px] pointer-events-none">
        SwiftApp Preview Engine
      </div>
    </div>
  );
}
