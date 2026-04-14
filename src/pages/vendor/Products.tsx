import React, { useState } from 'react';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Search, Plus, Edit2, Trash2, Package, Loader2, X, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVendorProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useToggleProduct } from '@/hooks/useVendor';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const getBusinessLabels = (type: string) => {
  switch (type) {
    case 'TAXI':
    case 'CAR_RENTAL':
      return { title: 'Vyombo vya Usafiri', addBtn: 'Ongeza Chombo', item: 'Chombo' };
    case 'HOTEL':
      return { title: 'Vyumba', addBtn: 'Ongeza Chumba', item: 'Chumba' };
    case 'COURIER':
      return { title: 'Huduma', addBtn: 'Ongeza Huduma', item: 'Huduma' };
    default:
      return { title: 'Bidhaa', addBtn: 'Ongeza Bidhaa', item: 'Bidhaa' };
  }
};

export default function VendorProducts() {
  const { user } = useAuth();
  const isWholesaler = user?.vendor?.isWholesaler || false;
  const labels = getBusinessLabels(user?.businessType || 'SHOP');
  
  const [search, setSearch] = useState('');
  const { data, isLoading } = useVendorProducts({ search });
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProduct();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQty: '',
    categoryId: '',
    minOrderQty: '1',
    tieredPricing: '', // JSON string for tiered pricing
    expiryDate: '',
    unit: '',
    isPrescriptionRequired: false,
  });
  const [images, setImages] = useState<File[]>([]);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        stockQty: item.stockQty.toString(),
        categoryId: item.categoryId || '',
        minOrderQty: (item.minOrderQty || 1).toString(),
        tieredPricing: item.tieredPricing ? JSON.stringify(item.tieredPricing, null, 2) : '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        unit: item.unit || '',
        isPrescriptionRequired: item.isPrescriptionRequired || false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQty: '',
        categoryId: '',
        minOrderQty: '1',
        tieredPricing: '',
        expiryDate: '',
        unit: '',
        isPrescriptionRequired: false,
      });
    }
    setImages([]);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tieredPricing' && value) {
        try {
          // Validate JSON before sending
          JSON.parse(value as string);
          data.append(key, value as string);
        } catch (e) {
          toast.error('Mfumo wa bei za jumla lazima uwe katika muundo sahihi wa JSON');
          return;
        }
      } else {
        data.append(key, value.toString());
      }
    });
    images.forEach((image) => data.append('images', image));

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, formData: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${labels.item.toLowerCase()}?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">{labels.title}</h1>
            <p className="text-text-secondary font-medium">Manage your {labels.title.toLowerCase()} inventory and pricing.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Plus size={20} /> {labels.addBtn}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50/50">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${labels.title.toLowerCase()}...`} 
                className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-text-secondary font-bold">Loading {labels.title.toLowerCase()}...</p>
            </div>
          ) : data?.products?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
              {data.products.map((product: any) => (
                <motion.div 
                  layout
                  key={product.id} 
                  className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:border-primary transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-secondary hover:bg-white transition-colors shadow-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-danger hover:bg-white transition-colors shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-4 py-2 bg-danger text-white rounded-full text-xs font-black uppercase tracking-widest">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xl font-black text-secondary">TZS {product.price.toLocaleString()}</p>
                        <p className={`text-xs font-bold ${product.stockQty < 10 ? 'text-danger' : 'text-success'}`}>
                          {product.stockQty} {user?.businessType === 'TAXI' ? 'available' : 'in stock'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleMutation.mutate(product.id)}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-colors ${
                        product.isAvailable 
                        ? 'bg-gray-100 text-secondary hover:bg-gray-200' 
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {product.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <Package size={40} />
              </div>
              <div className="text-center">
                <p className="text-secondary font-black text-xl">No {labels.title.toLowerCase()} found</p>
                <p className="text-text-secondary font-medium">Start by adding your first {labels.item.toLowerCase()}.</p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="mt-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm"
              >
                {labels.addBtn}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-2xl p-8 my-8 relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-text-secondary hover:text-secondary transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-secondary mb-8">
                {editingItem ? `Edit ${labels.item}` : labels.addBtn}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary">Jina la {labels.item}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder={`Jina la ${labels.item}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary">Kundi (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder="mf. Elektroniki, Chakula" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Maelezo</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-32 bg-gray-50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                    placeholder={`Elezea ${labels.item.toLowerCase()} yako...`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary">Bei (TZS)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary">Stoo / Idadi</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stockQty}
                      onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                      className="w-full h-12 bg-gray-50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder="0" 
                    />
                  </div>
                </div>

                {(user?.vendor?.businessType === 'PHARMACY' || user?.vendor?.businessType === 'GROCERY') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-orange-700">Tarehe ya Kuisha (Expiry Date)</label>
                      <input 
                        type="date" 
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full h-12 bg-white border border-orange-200 rounded-xl px-4 focus:ring-2 focus:ring-orange-500/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-orange-700">Kipimo (Unit)</label>
                      <input 
                        type="text" 
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full h-12 bg-white border border-orange-200 rounded-xl px-4 focus:ring-2 focus:ring-orange-500/20 outline-none" 
                        placeholder="e.g. kg, piece, dose" 
                      />
                    </div>
                    {user?.vendor?.businessType === 'PHARMACY' && (
                      <div className="flex items-center gap-3 md:col-span-2">
                        <input 
                          type="checkbox" 
                          id="prescription"
                          checked={formData.isPrescriptionRequired}
                          onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })}
                          className="w-5 h-5 rounded border-orange-200 text-orange-600 focus:ring-orange-500" 
                        />
                        <label htmlFor="prescription" className="text-sm font-bold text-orange-700">Inahitaji Cheti cha Daktari (Prescription Required)</label>
                      </div>
                    )}
                  </div>
                )}

                {isWholesaler && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-blue-700">Kiasi cha Chini cha Oda (MOQ)</label>
                      <input 
                        type="number" 
                        value={formData.minOrderQty}
                        onChange={(e) => setFormData({ ...formData, minOrderQty: e.target.value })}
                        className="w-full h-12 bg-white border border-blue-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                        placeholder="1" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-blue-700">Bei za Jumla (JSON)</label>
                      <textarea 
                        value={formData.tieredPricing}
                        onChange={(e) => setFormData({ ...formData, tieredPricing: e.target.value })}
                        className="w-full h-24 bg-white border border-blue-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs font-mono" 
                        placeholder='[{"minQty": 10, "price": 5000}, {"minQty": 50, "price": 4500}]'
                      />
                      <p className="text-[10px] text-blue-500 font-medium italic">Weka viwango vya bei kulingana na idadi.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Picha</label>
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload size={20} className="text-text-secondary" />
                        <span className="text-[10px] font-bold text-text-secondary uppercase">Upload</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              setImages([...images, ...Array.from(e.target.files)]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-14 bg-gray-100 text-secondary rounded-xl font-black hover:bg-gray-200 transition-colors"
                  >
                    Ghairi
                  </button>
                  <button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 h-14 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={20} />}
                    {editingItem ? 'Hifadhi' : 'Ongeza'} {labels.item}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </VendorLayout>
  );
}
