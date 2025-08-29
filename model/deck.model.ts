import { DeckCard, GameCard } from "./card.model";

export interface LightDeck {
  deckuid: string;
  deckname: string;
  deckcover: string; //In leader-based TCG, deckcover is going to be the leader.
}

export interface Deck extends LightDeck {
  listofcards: GameCard[];
}

export interface DeckRecord extends LightDeck {
  listofcards: DeckCard[];
}
