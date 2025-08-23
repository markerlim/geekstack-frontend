import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { GameCard } from "../model/card.model";
import { TCGTYPE } from "../utils/constants";
import { Deck } from "../model/deck.model";

type DeckCard = {
  card: GameCard;
  count: number;
};

type DeckContextType = {
  deckCards: DeckCard[];
  cardlist: GameCard[];
  selectedDeck: Deck;
  isPreFilterRequired?: boolean;
  preFilterList?: Record<string, string[]>;
  setCardlist: (gameCards: GameCard[]) => void;
  setSelectedDeck: (deck: Deck) => void;
  setPreFilterList: (filters: Record<string, string[]>) => void;
  setIsPreFilterRequired: (required: boolean) => void;
  updateDeckName: (name: string) => void;
  addCard: (card: GameCard, tcgGame?: string) => void;
  removeCard: (cardId: string) => void;
  getCardCount: (cardId: string) => number;
  getCardData: (cardId: string) => GameCard | undefined;
  clearList: () => void;
};

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck>({
    deckuid: "",
    deckname: "DeckName",
    deckcover: "/gsdeckimage.jpg",
    listofcards: [],
  });
  const [preFilterList, setPreFilterList] = useState<Record<string, string[]>>();
  const [isPreFilterRequired, setIsPreFilterRequired] = useState(false);

  const addCard = (card: GameCard, tcgGame?: string) => {
    // Determine max copies
    const maxCopies =
      tcgGame === TCGTYPE.UNIONARENA && card.banRatio
        ? Math.min(4, card.banRatio)
        : 4;

    // Calculate current total count of this card for the cardId(Not unique)
    const currentTotalCount = deckCards
      .filter((item) => item.card.cardId === card.cardId)
      .reduce((sum, item) => sum + item.count, 0);
    console.log(currentTotalCount);
    // Find existing exact card match
    const existingCardIndex = deckCards.findIndex(
      (item) =>
        item.card._id === card._id && item.card.urlimage === card.urlimage
    );

    if (currentTotalCount >= maxCopies) {
      return; // Don't exceed max copies
    }

    setDeckCards((prev) => {
      if (existingCardIndex > -1) {
        return prev.map((item, index) =>
          index === existingCardIndex
            ? { ...item, count: item.count + 1 }
            : item
        );
      } else {
        return [...prev, { card, count: 1 }];
      }
    });
  };

  const removeCard = (_id: string) => {
    setDeckCards((prev) => {
      const existingCardIndex = prev.findIndex((item) => item.card._id === _id);

      if (existingCardIndex === -1) return prev;

      const updatedCards = [...prev];
      if (updatedCards[existingCardIndex].count > 1) {
        // Decrement count
        updatedCards[existingCardIndex] = {
          ...updatedCards[existingCardIndex],
          count: updatedCards[existingCardIndex].count - 1,
        };
      } else {
        // Remove entry completely
        updatedCards.splice(existingCardIndex, 1);
      }

      return updatedCards;
    });
  };

  const getCardCount = (_id: string) => {
    return deckCards
      .filter((item) => item.card._id === _id)
      .reduce((sum, item) => sum + item.count, 0);
  };

  const getCardData = (cardId: string) => {
    return deckCards.find((item) => item.card._id === cardId)?.card;
  };

  const setCardlist = (gameCards: GameCard[]) => {
    const cardMap = new Map<string, DeckCard>();
    gameCards.forEach((gameCard) => {
      cardMap.set(gameCard._id, {
        card: gameCard,
        count: gameCard.count,
      });
    });
    setDeckCards(Array.from(cardMap.values()));
  };

  const setSelectedDeck = (deck: Deck) => {
    setCurrentDeck(deck);
  };

  const updateDeckName = useCallback((name: string) => {
    console.log("Updating deck name to:", name); // Add this log
    setCurrentDeck((prev) => {
      const newDeck = {
        ...prev,
        deckname: name,
      };
      console.log("New deck state:", newDeck); // Verify the new state
      return newDeck;
    });
  }, []);

  const clearList = () => {
    return new Promise((resolve) => {
      if (cardlist.length > 0) {
        if (window.confirm("Are you sure you want to clear all cards?")) {
          setDeckCards([]);
          setCardlist([]);
          setSelectedDeck({
            deckuid: "",
            deckname: "DeckName",
            deckcover: "/gsdeckimage.jpg",
            listofcards: [],
          });
          resolve(true); // Confirmed
        } else {
          resolve(false); // Cancelled
        }
      } else {
        resolve(true); // No cards to clear
      }
    });
  };

  const cardlist = useMemo(() => {
    return deckCards.map((deckCard) => ({
      ...deckCard.card,
      count: deckCard.count, // Attach the count to each card
    }));
  }, [deckCards]);

  const value = useMemo(
    () => ({
      deckCards,
      cardlist,
      selectedDeck: currentDeck,
      preFilterList,
      isPreFilterRequired,
      setIsPreFilterRequired,
      setPreFilterList,
      setCardlist,
      setSelectedDeck,
      updateDeckName,
      addCard,
      removeCard,
      getCardCount,
      getCardData,
      clearList,
    }),
    [currentDeck, deckCards, preFilterList]
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDeck() {
  const context = useContext(DeckContext);

  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}
