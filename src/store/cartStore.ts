import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS } from '../data/products';

type ShopState = {
  cart: Record<string, number>;
  favs: Record<string, boolean>;
  add: (id: string) => void;
  dec: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleFav: (id: string) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: {},
      favs: {},
      add: (id) => set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + 1 } })),
      setQty: (id, qty) => set((s) => {
        const cart = { ...s.cart };
        if (qty <= 0) delete cart[id];
        else cart[id] = qty;
        return { cart };
      }),
      dec: (id) =>
        set((s) => {
          const q = (s.cart[id] ?? 0) - 1;
          const cart = { ...s.cart };
          if (q <= 0) delete cart[id];
          else cart[id] = q;
          return { cart };
        }),
      remove: (id) =>
        set((s) => {
          const cart = { ...s.cart };
          delete cart[id];
          return { cart };
        }),
      clear: () => set({ cart: {} }),
      toggleFav: (id) => set((s) => ({ favs: { ...s.favs, [id]: !s.favs[id] } })),
    }),
    {
      name: 'blh-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const selectCount = (s: ShopState) =>
  Object.values(s.cart).reduce((a, b) => a + b, 0);

export const selectTotal = (s: ShopState) =>
  PRODUCTS.reduce((sum, p) => sum + p.price * (s.cart[p.id] ?? 0), 0);

export const selectWholesaleTotal = (s: ShopState) =>
  PRODUCTS.reduce((sum, p) => sum + p.wholesalePrice * (s.cart[p.id] ?? 0), 0);

export const selectFavCount = (s: ShopState) =>
  Object.values(s.favs).filter(Boolean).length;