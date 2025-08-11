import { GameCard } from "./card.model";

export interface Deck {
  deckuid: string;
  deckname: string;
  deckcover: string; //In leader-based TCG, deckcover is going to be the leader.
  listofcards: GameCard[];
}
