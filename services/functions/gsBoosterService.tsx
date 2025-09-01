import {
  BaseGameCard,
  CardDragonBallZFW,
  CardOnePiece,
  CardUnionArena,
  CookieRunCard,
  DuelmastersCard,
  GameCard,
  GundamCard,
  HololiveCard,
} from "../../model/card.model";
import { getApiBaseUrl } from "../../utils/apiBase";
import { TCGTYPE } from "../../utils/constants";
import { db } from "../../services/indexdb/carddatabase"; // adjust path to your CardDatabase file

/**
 * /data -> for datas
 * /boosterlist -> for boosters
 * /fcm -> for notifications
 * /user -> for users
 * /userpost -> for posts
 */

/**
 * This function returns the list of booster by tcg
 * @param tcg
 * @returns
 */
export async function fetchBoosters(tcg: string) {
  /*const cachedData = await db.boosters.get(tcg);
  if (cachedData) {
    console.log(`✅ Fetched boosters for ${tcg} from IndexedDB`);
    return cachedData.data;
  }
    */

  try {
    const res = await fetch(`${getApiBaseUrl()}/boosterlist/${tcg}`);
    if (!res.ok) {
      throw new Error("Failed to fetch boosters");
    }
    const data = await res.json();
    /*
    const boosterData = {
      tcg,
      data,
      timestamp: new Date().toISOString(),
    };

    await db.boosters.put(boosterData);

    console.log(`✅ Saved boosters for ${tcg} to IndexedDB`);
    */
    return data;
  } catch (error) {
    console.error(`❌ Error saving boosters for ${tcg}:`, error);
    throw error;
  }
}

/**
 * This function returns the list of cards from the particular set
 * @param tcg
 * @param setType
 * @returns
 */
export async function fetchCardsByTcg(tcg: string, setType: string) {
  /*const cached = await db[tcg as TCGTYPE].where("setType").equals(setType).toArray();
  if (cached.length > 0) {
    console.log(`✅ Loaded for ${tcg} with set: ${setType} from IndexedDB`);
    return cached;
  }
*/
  const res = await fetch(`${getApiBaseUrl()}/data/${tcg}/${setType}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${setType} from ${tcg}`);
  }
  const rawData = await res.json();
  /*
  const cards: GameCard[] = rawData.map((rawCard: any) => {
    const mapped = mapToGameCard(rawCard, tcg);
    return {
      ...mapped,
      id: `${mapped._id}`,
      setType,
    };
  });

  await db[tcg as TCGTYPE].bulkPut(cards);
  */

  return rawData.map((rawCard: any) => mapToGameCard(rawCard, tcg));
}

export async function fetchOnePieceLeaders(
  page: number,
  size: number,
  searchterm: string
) {
  console.log(searchterm);
  const res = await fetch(
    `${getApiBaseUrl()}/data/onepiece/leaders?page=${page}&size=${size}&search=${searchterm}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch onepiece leaders`);
  }
  console.log(res);
  const rawData = await res.json();
  return rawData.map((rawCard: any) =>
    mapToGameCard(rawCard, TCGTYPE.ONEPIECE)
  );
}

export async function searchForCard(term: string, tcg: string) {
  if (!term.trim()) {
    return null;
  }
  const res = await fetch(`${getApiBaseUrl()}/data/${tcg}/search/${term}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cards`);
  }
  console.log(res);
  const rawData = await res.json();
  return rawData.map((rawCard: any) => mapToGameCard(rawCard, tcg));
}

/**
 * Fetch all TCG card data in one API call and seed IndexedDB
 */
export async function initAllCardsIndexDB(tcg: string) {
  const res = await fetch(`${getApiBaseUrl()}/data/${tcg}`);
  if (!res.ok) {
    throw new Error("Failed to fetch all TCG data");
  }

  const rawData = await res.json();

  const cards: GameCard[] = rawData.map((rawCard: any) => {
    const mapped = mapToGameCard(rawCard, tcg);
    const setType = rawCard.animeCode || rawCard.booster || "";
    return {
      ...mapped,
      id: `${mapped._id}`,
      setType: setType,
    };
  });

  await db[tcg as TCGTYPE].bulkPut(cards);

  console.log(`✅ Seeded ${rawData.length} cards into IndexedDB`);
}

function mapToGameCard(rawCard: any, tcgType: string) {
  if (!rawCard) return {} as BaseGameCard;

  const cardWithTcg = { ...rawCard, tcg: tcgType };

  switch (tcgType) {
    case TCGTYPE.UNIONARENA:
      return cardWithTcg as CardUnionArena;
    case TCGTYPE.ONEPIECE:
      return cardWithTcg as CardOnePiece;
    case TCGTYPE.DRAGONBALLZFW:
      return cardWithTcg as CardDragonBallZFW;
    case TCGTYPE.COOKIERUN:
      return cardWithTcg as CookieRunCard;
    case TCGTYPE.DUELMASTERS:
      return cardWithTcg as DuelmastersCard;
    case TCGTYPE.HOLOLIVE:
      return cardWithTcg as HololiveCard;
    case TCGTYPE.GUNDAM:
      return cardWithTcg as GundamCard;
    default:
      console.warn("Unknown card type:", tcgType);
      return cardWithTcg as BaseGameCard;
  }
}
