import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TransactionType = 'earn' | 'redeem';

export type Transaction = {
  id: string;
  type: TransactionType;
  points: number;
  label: string;
  createdAt: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isStaffMode: boolean;
  points: number;
  transactions: Transaction[];

  signIn: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;

  toggleStaffMode: () => void;
  earnPoints: (params: { points: number; label: string }) => void;
  redeemPoints: (params: { points: number; label: string }) => void;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export const useAppStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isStaffMode: false,
      points: 0,
      transactions: [],

      signIn: async ({ email }) => {
        // MVP: login mock (sin backend). Sustituir por Firebase Auth.
        set({
          user: {
            id: uid('user'),
            name: email.split('@')[0] ?? 'Freddos',
            email,
          },
        });
      },

      register: async ({ name, email }) => {
        // MVP: registro mock (sin backend). Sustituir por Firebase Auth.
        set({
          user: {
            id: uid('user'),
            name: name.trim() || 'Freddos',
            email,
          },
        });
      },

      signOut: () => set({ user: null, isStaffMode: false }),

      toggleStaffMode: () => set({ isStaffMode: !get().isStaffMode }),

      earnPoints: ({ points, label }) =>
        set((s) => ({
          points: s.points + points,
          transactions: [
            { id: uid('tx'), type: 'earn', points, label, createdAt: Date.now() },
            ...s.transactions,
          ],
        })),

      redeemPoints: ({ points, label }) =>
        set((s) => ({
          points: Math.max(0, s.points - points),
          transactions: [
            { id: uid('tx'), type: 'redeem', points, label, createdAt: Date.now() },
            ...s.transactions,
          ],
        })),
    }),
    {
      name: 'freddos-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        isStaffMode: s.isStaffMode,
        points: s.points,
        transactions: s.transactions,
      }),
    }
  )
);

