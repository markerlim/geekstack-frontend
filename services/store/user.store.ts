// user.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { initUser } from "../functions/gsUserDetailsService";
import { gsMongoUser, gsSQLUser } from "../../model/user.model";

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface UserStore {
  currentUser: User | null;
  mongoUser: gsMongoUser | null;
  sqlUser: gsSQLUser | null;
  loading: boolean;
  error: string | null;
  _lastUpdated: number | null;
  initializeUserStore: () => Promise<void>;
  clearUserStore: () => void;
  signOut: () => Promise<void>; // Added signOut method
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      mongoUser: null,
      sqlUser: null,
      loading: false,
      error: null,
      _lastUpdated: null,

      initializeUserStore: async () => {
        const { loading, _lastUpdated } = get();
        
        if (loading || (_lastUpdated && Date.now() - _lastUpdated < CACHE_DURATION)) {
          return;
        }
        
        const user = auth.currentUser;
        console.log(user)
        
        if (!user) {
          get().clearUserStore();
          return;
        }

        set({ loading: true, error: null });
        
        try {
          console.log("<<<<<<<<<<INIT>>>>>>>>>>")
          const response = await initUser();
          
          set({
            currentUser: user,
            mongoUser: response.gsMongoUser,
            sqlUser: response.gsSQLUser,
            loading: false,
            _lastUpdated: Date.now(),
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false,
            _lastUpdated: null
          });
        }
      },

      clearUserStore: () => {
        // This will be persisted to localStorage automatically
        set({
          currentUser: null,
          mongoUser: null,
          sqlUser: null,
          loading: false,
          error: null,
          _lastUpdated: null,
        });
      },

      // New signOut method that properly clears everything
      signOut: async () => {
        try {
          set({ loading: true });
          await firebaseSignOut(auth);
          get().clearUserStore();
          
          // Manually clear the persisted data
          localStorage.removeItem('user-storage');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed',
            loading: false
          });
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        mongoUser: state.mongoUser,
        sqlUser: state.sqlUser,
        _lastUpdated: state._lastUpdated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state._lastUpdated && Date.now() - state._lastUpdated > CACHE_DURATION) {
          state.clearUserStore();
        }
      },
    }
  )
);

// Auth listener setup
let unsubscribe: () => void;

if (typeof window !== "undefined") {
  unsubscribe = onAuthStateChanged(auth, () => {
    console.log("test")
    useUserStore.getState().initializeUserStore();
  });

  window.addEventListener("beforeunload", () => {
    if (unsubscribe) unsubscribe();
  });
}