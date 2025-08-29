import Dexie, { Table } from "dexie";
import { GameCard } from "../../model/card.model";
import { Booster } from "../../model/booster.model";

class CardDatabase extends Dexie {
  cards!: Table<GameCard, string>;
  boosters!: Table<{ tcg: string; data: Booster[]; timestamp: string }, string>; // tcg as primary key

  constructor() {
    super("CardDB");
    this.version(1).stores({
      cards: "id, tcg, setType",
      boosters: "tcg"
    });
  }
}

export const db = new CardDatabase();
