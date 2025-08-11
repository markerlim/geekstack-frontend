export interface CurrencySlice {
  exchangeRate: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  baseCurrency: string;
  targetCurrency: string;
  fetchExchangeRate: (base?: string, symbol?: string) => Promise<void>;
  setCurrencies: (base: string, target: string) => void;
}

export interface UserSlice {
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  updatePreferences: (prefs: Partial<UserSlice['preferences']>) => void;
}

export interface AppSlice {
  notifications: Notification[];
  addNotification: (message: string, type?: 'info' | 'error' | 'success') => void;
  clearNotifications: () => void;
}