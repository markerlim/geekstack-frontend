import {
  BaseGameCard,
  CardDragonBallZFW,
  CardOnePiece,
  CardUnionArena,
  CookieRunCard,
  DuelmastersCard,
  HololiveCard,
} from "../../model/card.model";
import { DeckPost } from "../../model/deckpost.model";
import { getApiBaseUrl } from "../../utils/apiBase";
import apiClient from "../../utils/apiClient";
import { TCGTYPE } from "../../utils/constants";

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
  const res = await fetch(`${getApiBaseUrl()}/boosterlist/${tcg}`);
  if (!res.ok) {
    throw new Error("Failed to fetch boosters");
  }
  return res.json();
}

/**
 * This function returns the list of cards from the particular set
 * @param tcg
 * @param setType
 * @returns
 */
export async function fetchCardsByTcg(tcg: string, setType: string) {
  const res = await fetch(`${getApiBaseUrl()}/data/${tcg}/${setType}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${setType} from ${tcg}`);
  }
  const rawData = await res.json();

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
  return rawData.map((rawCard: any) =>
    mapToGameCard(rawCard, tcg)
  );
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
    default:
      console.warn("Unknown card type:", tcgType);
      return cardWithTcg as BaseGameCard;
  }
}
