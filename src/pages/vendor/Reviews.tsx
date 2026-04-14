import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Star, MessageSquare, User, Calendar, Reply, Loader2, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function VendorReviews() {
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');
  
  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['vendor-reviews', ratingFilter],
    queryFn: async () => {
      const response = await api.get('/vendor/reviews', { params: { rating: ratingFilter === 'All' ? undefined : ratingFilter } });
      return response.data;
    }
  });

  const handleReply = async (reviewId: string, reply: string) => {
    try {
      await api.post(`/vendor/reviews/${reviewId}/reply`, { reply });
      toast.success('Jibu lako limetumwa kikamilifu');
      refetch();
    } catch (error) {
      toast.error('Imeshindikana kutuma jibu');
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight uppercase">Mapitio ya Wateja</h1>
            <p className="text-[#6B7280] font-bold">Soma na ujibu maoni ya wateja wako.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-white border border-[#E5E7EB] rounded-2xl p-1 shadow-sm">
              {['All', 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    ratingFilter === star ? 'bg-[#1A1A2E] text-white shadow-lg' : 'text-[#6B7280] hover:bg-gray-100'
                  }`}
                >
                  {star === 'All' ? 'Zote' : (
                    <>
                      {star} <Star size={12} fill="currentColor" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#FF6B35]" size={48} />
            <p className="text-[#6B7280] font-black uppercase tracking-widest">Inapakia Mapitio...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews?.map((review: any) => (
              <div key={review.id} className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Customer Info & Rating */}
                  <div className="md:w-64 flex-shrink-0 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A2E]">
                        <User size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-[#1A1A2E] leading-tight">{review.customer?.name}</h4>
                        <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-widest">{format(new Date(review.createdAt), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={18} 
                          className={s <= review.rating ? 'text-[#FFD93D]' : 'text-gray-200'} 
                          fill={s <= review.rating ? 'currentColor' : 'none'} 
                        />
                      ))}
                    </div>
                    <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                      <p className="text-[10px] font-black text-[#6B7280] uppercase mb-1">Bidhaa:</p>
                      <p className="text-xs font-bold text-[#1A1A2E] line-clamp-1">{review.product?.name}</p>
                    </div>
                  </div>

                  {/* Review Content & Reply */}
                  <div className="flex-1 space-y-6">
                    <div className="relative p-6 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]">
                      <MessageSquare className="absolute -top-3 -left-3 text-[#FF6B35]/20" size={40} />
                      <p className="text-[#1A1A2E] font-bold leading-relaxed italic">"{review.comment}"</p>
                    </div>

                    {review.reply ? (
                      <div className="ml-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 relative">
                        <Reply className="absolute -top-3 -left-3 text-blue-200" size={32} />
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Jibu Lako:</span>
                          <span className="text-[10px] text-blue-400 font-bold">{format(new Date(review.repliedAt), 'dd MMM yyyy')}</span>
                        </div>
                        <p className="text-blue-800 font-bold text-sm leading-relaxed">{review.reply}</p>
                      </div>
                    ) : (
                      <div className="ml-8">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const reply = (e.target as any).reply.value;
                            if (reply) handleReply(review.id, reply);
                          }}
                          className="flex gap-3"
                        >
                          <input 
                            name="reply"
                            type="text" 
                            placeholder="Andika jibu lako hapa..." 
                            className="flex-1 h-12 bg-white border border-[#E5E7EB] rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                          />
                          <button 
                            type="submit"
                            className="px-6 bg-[#1A1A2E] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                          >
                            Jibu
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(!reviews || reviews.length === 0) && (
              <div className="py-32 text-center bg-white rounded-[32px] border border-[#E5E7EB]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Star size={40} />
                </div>
                <p className="text-[#6B7280] font-black uppercase tracking-widest">Bado huna mapitio yoyote.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
