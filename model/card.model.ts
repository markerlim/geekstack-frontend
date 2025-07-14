import { TCGTYPE } from "../utils/constants";

export type GameCard =
  | CardUnionArena
  | CookieRunCard
  | CardDragonBallZFW
  | DuelmastersCard
  | CardOnePiece
  | HololiveCard
  | GundamCard;

export interface BaseGameCard {
  _id: string;
  imageSrc: string;
  cardName: string;
  banRatio: number;
  count: number;
}

export interface CardUnionArena extends BaseGameCard {
  tcg?: typeof TCGTYPE.UNIONARENA;
  anime: string;
  animeCode: string;
  apcost: number;
  banWith: string;
  basicpower: string;
  booster: string;
  cardId: string;
  cardUid: string;
  cardNameLower: string;
  category: string;
  color: string;
  effect: string;
  energycost: number;
  energygen: string;
  rarity: string;
  traits: string;
  trigger: string;
  triggerState: string;
  urlimage: string;
  rarityAct: string;
  cardcode: string;
  price_yyt_id: string;
  price_fulla_id: string;
  YYT: string;
  FULLA: string;
}

/**
 * When using must rmb to assign card imageSrc and cardName
 * const enrichedCard: CookieRunCard = {
  ...rawCard,
  imageSrc: rawCard.urlimage,
  cardName: rawCard.title,
  count: 0,
};
 */
export interface CookieRunCard extends BaseGameCard {
  tcg: typeof TCGTYPE.COOKIERUN;
  id: number;
  elementId: number;
  title: string;
  artistTitle: string;
  productTitle: string;
  cardDescription: string;
  rarity: string;
  hp: string;
  cardNo: string;
  grade: string;
  urlimage: string;
  productCategory: string;
  productCategoryTitle: string;
  cardType: string;
  cardTypeTitle: string;
  energyType: string;
  energyTypeTitle: string;
  cardLevel: string;
  cardLevelTitle: string;
  boostercode: string;
  cardUid: string;
  cardId: string;
}

export interface CardDragonBallZFW extends BaseGameCard {
  tcg?: typeof TCGTYPE.DRAGONBALLZFW;
  awakenform: boolean;
  booster: string;
  cardId: string;
  cardUid: string;
  cardNameLower: string;
  cardtype: string;
  cardtypeLower: string;
  color: string;
  colorLower: string;
  combopower: string;
  cost: string;
  effects: string;
  features: string;
  featuresLower: string;
  image: string;
  power: string;
  rarity: string;
  raritySub: string;
  setFrom: string;
  specifiedcost: string;
  urlimage: string;
  YYT: string;
  price_yyt_id: string;
}

export interface DuelmastersCard extends BaseGameCard {
  tcg: typeof TCGTYPE.DUELMASTERS;
  detailUrl: string;
  urlimage: string;
  type: string;
  typeJP: string;
  civilization: string[];
  civilizationJP: string[];
  rarity: string;
  power: string;
  cost: string;
  mana: string;
  race: string[];
  raceJP: string[];
  illustrator: string;
  effects: string;
  effectsJP: string;
  cardUid: string;
  cardId: string;
  booster: string;
  type2: string;
  type2JP: string;
  civilization2: string[];
  civilization2JP: string[];
  power2: string;
  cost2: string;
  mana2: string;
  race2: string[];
  race2JP: string[];
  effects2: string;
  effects2JP: string;
  cardName2: string;
}

export interface CardOnePiece extends BaseGameCard {
  tcg?: typeof TCGTYPE.ONEPIECE;
  cardId: string;
  rarity: string;
  category: string;
  lifecost: string;
  attribute: string;
  power: string;
  counter: string;
  color: string;
  typing: string;
  effects: string;
  trigger: string;
  urlimage: string;
  cardUid: string;
  booster: string;
}

export interface HololiveCard extends BaseGameCard {
  tcg: typeof TCGTYPE.HOLOLIVE;
  urlimage: string;
  detailUrl: string;
  cardNameJP: string;
  cardType: string;
  cardTypeJP: string;
  rarity: string;
  included_products: string;
  color: string | null;
  life: string | null;
  hp: string | null;
  bloomLevel: string | null;
  passingBaton: string | null;
  spArts: string | null;
  tags: string[];
  skillJP: string;
  skill: string;
  keywordJP: string | null;
  keyword: string | null;
  spSkillJP: string;
  spSkill: string;
  illustrator: string;
  cardId: string;
  cardUid: string;
  booster: string;
}

export interface GundamCard extends BaseGameCard {
  tcg: typeof TCGTYPE.GUNDAM;
  cardId: string;
  packageId: string;
  series: string;
  urlimage: string;
  cardUid: string;
  detail_url: string;
  rarity: string;
  level: string;
  cost: string;
  color: string;
  cardType: string;
  effect: string;
  zone: string;
  trait: string;
  link: string;
  attackPower: string;
  hitPoints: string;
  sourceTitle: string;
  obtainedFrom: string;
}
