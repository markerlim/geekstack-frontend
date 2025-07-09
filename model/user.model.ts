import { Deck } from "./deck.model";

export interface gsUser {
  userId: string;
}

export interface gsSQLUser extends gsUser {
  name: string;
  displaypic: string;
}

export interface gsMongoUser extends gsUser {
  crbdecks: Deck[];
  uadecks: Deck[];
  opdecks: Deck[];
  dbzfwdecks: Deck[];
  dmdecks: Deck[];
  hocgdecks: Deck[];
}