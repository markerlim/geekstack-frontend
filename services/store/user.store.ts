import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth } from "../../utils/firebase";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { initUser } from "../functions/gsUserDetailsService";
import { gsMongoUser, gsSQLUser } from "../../model/user.model";
import { Deck } from "../../model/deck.model";
import { TCGTYPE } from "../../utils/constants";

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

type DeckCategory = keyof Omit<gsMongoUser, "userId">;

const EMPTY_DECKS: readonly Deck[] = Object.freeze([]);

const deckFieldMap: Record<TCGTYPE, keyof Omit<gsMongoUser, "userId">> = {
  [TCGTYPE.UNIONARENA]: "uadecks",
  [TCGTYPE.ONEPIECE]: "opdecks",
  [TCGTYPE.COOKIERUN]: "crbdecks",
  [TCGTYPE.DUELMASTERS]: "dmdecks",
  [TCGTYPE.DRAGONBALLZFW]: "dbzfwdecks",
  [TCGTYPE.GUNDAM]: "gcgdecks",
  [TCGTYPE.HOLOLIVE]: "hocgdecks",
};

interface UserStore {
  currentUser: User | null;
  mongoUser: gsMongoUser | null;
  sqlUser: gsSQLUser | null;
  loading: boolean;
  error: string | null;
  _lastUpdated: number | null;

  // Existing actions
  initializeUserStore: () => Promise<void>;
  clearUserStore: () => void;
  signOut: () => Promise<void>;

  // gsMongoUser actions
  updateMongoUser: (updates: Partial<gsMongoUser>) => void;

  // Deck management actions
  addDeckToCategory: (category: DeckCategory, deck: Deck) => void;
  removeDeckFromCategory: (category: DeckCategory, deckId: string) => void;
  updateDeckInCategory: (
    category: DeckCategory,
    deckId: string,
    updates: Partial<Deck>
  ) => void;
  setDecksForCategory: (category: DeckCategory, decks: Deck[]) => void;
  clearDecksForCategory: (category: DeckCategory) => void;

  // Getter helpers
  getDecksByCategory: (category: string) => Deck[];
  getAllDecks: () => Deck[];
  getDeckById: (
    deckId: string
  ) => { deck: Deck; category: DeckCategory } | null;
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

        if (
          loading ||
          (_lastUpdated && Date.now() - _lastUpdated < CACHE_DURATION)
        ) {
          return;
        }

        const user = auth.currentUser;

        if (!user) {
          get().clearUserStore();
          return;
        }

        set({ loading: true, error: null });

        try {
          console.log("<<<<<<<<<<INIT>>>>>>>>>>");
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
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
            _lastUpdated: null,
          });
        }
      },

      clearUserStore: () => {
        set({
          currentUser: null,
          mongoUser: null,
          sqlUser: null,
          loading: false,
          error: null,
          _lastUpdated: null,
        });
      },

      signOut: async () => {
        try {
          set({ loading: true });
          await firebaseSignOut(auth);
          get().clearUserStore();

          // Manually clear the persisted data
          localStorage.removeItem("user-storage");
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
            loading: false,
          });
        } finally {
          set({ loading: false });
        }
      },

      // gsMongoUser actions
      updateMongoUser: (updates: Partial<gsMongoUser>) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: { ...mongoUser, ...updates },
          _lastUpdated: Date.now(),
        });
      },

      // Deck management actions
      addDeckToCategory: (category: DeckCategory, deck: Deck) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: {
            ...mongoUser,
            [category]: [...mongoUser[category], deck],
          },
          _lastUpdated: Date.now(),
        });
      },

      removeDeckFromCategory: (category: DeckCategory, deckId: string) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: {
            ...mongoUser,
            [category]: mongoUser[category].filter(
              (deck) => deck.deckuid !== deckId
            ),
          },
          _lastUpdated: Date.now(),
        });
      },

      updateDeckInCategory: (
        category: DeckCategory,
        deckId: string,
        updates: Partial<Deck>
      ) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: {
            ...mongoUser,
            [category]: mongoUser[category].map((deck) =>
              deck.deckuid === deckId ? { ...deck, ...updates } : deck
            ),
          },
          _lastUpdated: Date.now(),
        });
      },

      setDecksForCategory: (category: DeckCategory, decks: Deck[]) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: {
            ...mongoUser,
            [category]: decks,
          },
          _lastUpdated: Date.now(),
        });
      },

      clearDecksForCategory: (category: DeckCategory) => {
        const { mongoUser } = get();
        if (!mongoUser) return;

        set({
          mongoUser: {
            ...mongoUser,
            [category]: [],
          },
          _lastUpdated: Date.now(),
        });
      },

      // Getter helpers
      getDecksByCategory: (category: string): Deck[] => {
        const { mongoUser } = get();
        const deckField = deckFieldMap[category as TCGTYPE];
        return [...(mongoUser?.[deckField] || EMPTY_DECKS)];
      },

      getAllDecks: () => {
        const { mongoUser } = get();
        if (!mongoUser) return [];

        return [
          ...mongoUser.crbdecks,
          ...mongoUser.uadecks,
          ...mongoUser.opdecks,
          ...mongoUser.dbzfwdecks,
          ...mongoUser.dmdecks,
          ...mongoUser.gcgdecks,
          ...mongoUser.hocgdecks,
        ];
      },

      getDeckById: (deckId: string) => {
        const { mongoUser } = get();
        if (!mongoUser) return null;

        const categories: DeckCategory[] = [
          "crbdecks",
          "uadecks",
          "opdecks",
          "dbzfwdecks",
          "dmdecks",
          "gcgdecks",
          "hocgdecks",
        ];

        for (const category of categories) {
          const deck = mongoUser[category].find((d) => d.deckuid === deckId);
          if (deck) {
            return { deck, category };
          }
        }

        return null;
      },
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
        if (
          state &&
          state._lastUpdated &&
          Date.now() - state._lastUpdated > CACHE_DURATION
        ) {
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
    useUserStore.getState().initializeUserStore();
  });

  window.addEventListener("beforeunload", () => {
    if (unsubscribe) unsubscribe();
  });
}
