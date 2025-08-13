// stores/useAppStore.ts
import { create } from "zustand";
import { getExcRate } from "../functions/gsUserDetailsService";
import { CurrencySlice, UserSlice, AppSlice } from "../../model/storeTypes";
import {DEFAULT_BASE_CURRENCY, DEFAULT_TARGET_CURRENCY} from "../../utils/constants";

interface InitSlice {
  _init: () => void;
}

const createCurrencySlice = (
  set: any,
  get: any
): CurrencySlice & InitSlice => ({
  exchangeRate: null,
  loading: false,
  error: null,
  lastUpdated: null,
  baseCurrency: "SGD",
  targetCurrency: "JPY",

  // Private initialization method
  _init: () => {
    if (!get().exchangeRate && !get().loading) {
      get().fetchExchangeRate();
    }
  },

  fetchExchangeRate: async (base = DEFAULT_BASE_CURRENCY, symbol = DEFAULT_TARGET_CURRENCY) => {
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const rate = await getExcRate(base, symbol);
      set({
        exchangeRate: parseFloat(rate),
        lastUpdated: new Date(),
        loading: false,
        baseCurrency: base,
        targetCurrency: symbol,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch rate",
        loading: false,
      });
    }
  },

  setCurrencies: (base, target) => {
    set({ baseCurrency: base, targetCurrency: target });
    get().fetchExchangeRate(base, target);
  },
});

const createUserSlice = (set: any): UserSlice => ({
  preferences: {
    theme: "light",
    language: "en-US",
  },
  updatePreferences: (prefs) =>
    set((state:any) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
});

const createAppSlice = (set: any): AppSlice => ({
  notifications: [],
  addNotification: (message, type = "info") =>
    set((state:any) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), message, type, timestamp: new Date() },
      ],
    })),
  clearNotifications: () => set({ notifications: [] }),
});

export const useAppStore = create<
  CurrencySlice & UserSlice & AppSlice & InitSlice
>()((set, get) => {
  const store = {
    ...createCurrencySlice(set, get),
    ...createUserSlice(set),
    ...createAppSlice(set),
  };

  // Initialize on store creation
  setTimeout(() => store._init(), 0);

  return store;
});

export const initializeStore = () => {
  const { _init } = useAppStore.getState();
  _init?.();
};
