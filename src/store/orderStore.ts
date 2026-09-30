import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address?: any; // To store Address snapshot
  paymentMethod?: string;
  isStoreOrder?: boolean;
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => string;
};

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (orderData) => {
        const newId = `BLH-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder: Order = {
          ...orderData,
          id: newId,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: 'Pending',
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newId;
      },
    }),
    {
      name: 'blh-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
