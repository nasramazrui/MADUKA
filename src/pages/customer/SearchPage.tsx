import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search as SearchIcon, 
  X, 
  History, 
  Star, 
  Clock, 
  ArrowRight,
  Filter,
  ChevronRight
} from 'lucide-react';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'ALL', name: 'Zote' },
  { id: 'FOOD', name: 'Chakula' },
  { id: 'GROCERY', name: 'Grocery' },
  { id: 'PHARMACY', name: 'Dawa' },
  { id: 'SHOP', name: 'Maduka' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [recentSearches, setRecentSearches] = useState(['Pizza', 'Dawa ya meno', 'Kuku', 'Maziwa']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query, selectedCategory],
    queryFn: async () => {
      if (!query && selectedCategory === 'ALL') return null;
      // Mock results
      return {
        vendors: [
          { id: '1', businessName: 'Karibu Restaurant', businessType: 'RESTAURANT', avgRating: 4.8, distance: '1.2 km', logoUrl: 'https://picsum.photos/seed/v1/100' },
        ],
        products: [
          { id: 'p1', name: 'Pizza Pepperoni', price: 15000, vendorName: 'Karibu Restaurant', imageUrl: 'https://picsum.photos/seed/p1/200' },
          { id: 'p2', name: 'Kuku wa Kupaka', price: 12000, vendorName: 'Mama Ntilie', imageUrl: 'https://picsum.photos/seed/p2/200' },
        ]
      };
    },
    enabled: query.length > 2 || selectedCategory !== 'ALL'
  });

  const clearRecent = () => setRecentSearches([]);
  const removeRecent = (item: string) => setRecentSearches(prev => prev.filter(i => i !== item));

  return (
    <CustomerLayout title="Tafuta">
      <div className="px-4 py-6 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
          <Input 
            ref={inputRef}
            placeholder="Tafuta chakula, maduka au bidhaa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-12 rounded-2xl border-[#E5E7EB] focus:border-[#FF6B35] focus:ring-[#FF6B35]/10 font-bold text-lg"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-[#F8F9FA] rounded-full text-[#6B7280]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' 
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!query && selectedCategory === 'ALL' ? (
            /* Recent Searches */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Tafuta hivi karibuni</h3>
                <button onClick={clearRecent} className="text-xs font-bold text-[#FF6B35]">Futa Zote</button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 group">
                    <button 
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <History size={18} className="text-[#6B7280]" />
                      <span className="font-bold text-[#1A1A2E]">{item}</span>
                    </button>
                    <button onClick={() => removeRecent(item)} className="p-2 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Search Results */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-[#6B7280]">Tunatafuta...</p>
                </div>
              ) : (
                <>
                  {/* Vendor Results */}
                  {results?.vendors && results.vendors.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Wauzaji</h3>
                      <div className="space-y-4">
                        {results.vendors.map((vendor) => (
                          <button 
                            key={vendor.id}
                            onClick={() => navigate(`/vendor/${vendor.id}`)}
                            className="w-full bg-white p-4 rounded-[24px] border border-[#E5E7EB] flex gap-4 shadow-sm group"
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                              <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left py-1">
                              <h4 className="font-black text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">{vendor.businessName}</h4>
                              <p className="text-xs font-bold text-[#6B7280] mt-0.5">{vendor.businessType}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                                  <span className="text-[10px] font-black">{vendor.avgRating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={12} className="text-[#6B7280]" />
                                  <span className="text-[10px] font-bold text-[#6B7280]">{vendor.distance}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={20} className="self-center text-[#6B7280]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Results */}
                  {results?.products && results.products.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Bidhaa</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {results.products.map((product) => (
                          <div key={product.id} className="bg-white p-3 rounded-[24px] border border-[#E5E7EB] shadow-sm space-y-3">
                            <div className="aspect-square rounded-2xl overflow-hidden">
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-[#1A1A2E] truncate">{product.name}</h4>
                              <p className="text-[10px] font-bold text-[#6B7280]">{product.vendorName}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[#FF6B35] font-black text-sm">TZS {product.price.toLocaleString()}</span>
                                <button className="w-8 h-8 bg-[#FF6B35] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!results?.vendors?.length && !results?.products?.length) && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center text-[#6B7280]">
                        <SearchIcon size={40} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#1A1A2E]">Hatujapata matokeo</h3>
                        <p className="text-sm font-bold text-[#6B7280] mt-1">Jaribu kutafuta kitu kingine</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CustomerLayout>
  );
}
