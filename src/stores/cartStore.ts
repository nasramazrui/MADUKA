import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Vendor } from '@/types';

export interface CartItem {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  vendorName: string | null;
  promoCode: string | null;
  discount: number;
  deliveryFee: number;
  
  addItem: (product: Product, vendor: Vendor) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string, discountAmount: number) => void;
  
  // Computed values (getters)
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,
      vendorName: null,
      promoCode: null,
      discount: 0,
      deliveryFee: 2000, // Default delivery fee

      addItem: (product, vendor) => {
        const { items, vendorId } = get();
        
        // Check if adding from a different vendor
        if (vendorId && vendorId !== vendor.id) {
          // This should be handled by a confirmation dialog in the UI
          // For now, we'll just prevent it or clear it
          return;
        }

        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.productId === product.id 
                ? { ...item, qty: item.qty + 1 } 
                : item
            )
          });
        } else {
          set({
            items: [...items, {
              productId: product.id,
              vendorId: vendor.id,
              name: product.name,
              price: product.price,
              qty: 1,
              image: product.images[0] || 'https://picsum.photos/seed/product/200'
            }],
            vendorId: vendor.id,
            vendorName: vendor.businessName
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter(item => item.productId !== productId);
        set({
          items: newItems,
          vendorId: newItems.length === 0 ? null : get().vendorId,
          vendorName: newItems.length === 0 ? null : get().vendorName
        });
      },

      updateQty: (productId, qty) => {
        const { items } = get();
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: items.map(item => 
            item.productId === productId ? { ...item, qty } : item
          )
        });
      },

      clearCart: () => set({ 
        items: [], 
        vendorId: null, 
        vendorName: null, 
        promoCode: null, 
        discount: 0 
      }),

      applyPromoCode: (code, discountAmount) => set({ 
        promoCode: code, 
        discount: discountAmount 
      }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + get().deliveryFee - get().discount;
      }
    }),
    {
      name: 'swiftapp-cart',
    }
  )
);
