import Dexie, { Table } from "dexie";
import { GameCard } from "../../model/card.model";
import { Booster } from "../../model/booster.model";
import { TCGTYPE } from "../../utils/constants";

class CardDatabase extends Dexie {
  unionarena!: Table<GameCard, string>;
  onepiece!: Table<GameCard, string>;
  cookierunbraverse!: Table<GameCard, string>;
  duelmasters!: Table<GameCard, string>;
  dragonballzfw!: Table<GameCard, string>;
  gundam!: Table<GameCard, string>;
  hololive!: Table<GameCard, string>;
  boosters!: Table<{ tcg: string; data: Booster[]; timestamp: string }, string>;

  constructor() {
    super("CardDB");
    this.version(1).stores({
      [TCGTYPE.UNIONARENA]: "_id, setType",
      [TCGTYPE.ONEPIECE]: "_id, setType",
      [TCGTYPE.COOKIERUN]: "_id, setType",
      [TCGTYPE.DUELMASTERS]: "_id, setType",
      [TCGTYPE.DRAGONBALLZFW]: "_id, setType",
      [TCGTYPE.GUNDAM]: "_id, setType",
      [TCGTYPE.HOLOLIVE]: "_id, setType",
      boosters: "tcg",
    });
  }
}

export const db = new CardDatabase();
