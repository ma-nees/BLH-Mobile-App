import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
  id: string;
  type: string; // 'Home', 'Work', 'Other'
  name: string;
  phone: string;
  street: string;
  city: string;
};

type AddressState = {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    type: 'Home',
    name: 'John Deo',
    phone: '+977 980-0000000',
    street: '123 Main Street, Phase 1',
    city: 'Bhairahawa',
  }
];

export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      addresses: INITIAL_ADDRESSES,
      addAddress: (addr) => {
        const newAddr: Address = {
          ...addr,
          id: Math.random().toString(36).substring(2, 9),
        };
        set((state) => ({ addresses: [...state.addresses, newAddr] }));
      },
      removeAddress: (id) => {
        set((state) => ({ addresses: state.addresses.filter(a => a.id !== id) }));
      },
    }),
    {
      name: 'blh-addresses-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
