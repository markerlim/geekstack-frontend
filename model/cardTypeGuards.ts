import { TCGTYPE } from "../utils/constants";
import {
  GameCard,
  CardUnionArena,
  CookieRunCard,
  CardDragonBallZFW,
  DuelmastersCard,
  CardOnePiece,
  HololiveCard,
  GundamCard
} from "../model/card.model";

// Union Arena Type Guard
export function isUnionArenaCard(card: GameCard): card is CardUnionArena {
  return (
    'energycost' in card &&
    'category' in card &&
    'apcost' in card &&
    'anime' in card &&
    (!card.tcg || card.tcg === TCGTYPE.UNIONARENA)
  );
}

// Cookie Run Type Guard
export function isCookieRunCard(card: GameCard): card is CookieRunCard {
  return (
    'elementId' in card &&
    'productTitle' in card &&
    'cardDescription' in card &&
    'productCategory' in card &&
    card.tcg === TCGTYPE.COOKIERUN
  );
}

// Dragon Ball Z Type Guard
export function isDragonBallZCard(card: GameCard): card is CardDragonBallZFW {
  return (
    'awakenform' in card &&
    'cardtype' in card &&
    'combopower' in card &&
    'specifiedcost' in card &&
    (!card.tcg || card.tcg === TCGTYPE.DRAGONBALLZFW)
  );
}

// Duel Masters Type Guard
export function isDuelmastersCard(card: GameCard): card is DuelmastersCard {
  return (
    'civilization' in card &&
    'mana' in card &&
    'race' in card &&
    'typeJP' in card &&
    card.tcg === TCGTYPE.DUELMASTERS
  );
}

// One Piece Type Guard
export function isOnePieceCard(card: GameCard): card is CardOnePiece {
  return (
    'lifecost' in card &&
    'attribute' in card &&
    'counter' in card &&
    'typing' in card &&
    (!card.tcg || card.tcg === TCGTYPE.ONEPIECE)
  );
}

// Hololive Type Guard
export function isHololiveCard(card: GameCard): card is HololiveCard {
  return (
    'cardNameJP' in card &&
    'bloomLevel' in card &&
    'passingBaton' in card &&
    'spArts' in card &&
    card.tcg === TCGTYPE.HOLOLIVE
  );
}

// Gundam Type Guard
export function isGundamCard(card: GameCard): card is GundamCard {
  return (
    'packageId' in card &&
    'series' in card &&
    'zone' in card &&
    'trait' in card &&
    card.tcg === TCGTYPE.GUNDAM
  );
}

// Utility function to get TCG type from card
export function getCardTCGType(card: GameCard): TCGTYPE {
  if (isUnionArenaCard(card)) return TCGTYPE.UNIONARENA;
  if (isCookieRunCard(card)) return TCGTYPE.COOKIERUN;
  if (isDragonBallZCard(card)) return TCGTYPE.DRAGONBALLZFW;
  if (isDuelmastersCard(card)) return TCGTYPE.DUELMASTERS;
  if (isOnePieceCard(card)) return TCGTYPE.ONEPIECE;
  if (isHololiveCard(card)) return TCGTYPE.HOLOLIVE;
  if (isGundamCard(card)) return TCGTYPE.GUNDAM;
  
  // Default fallback (you might want to handle this differently)
  return TCGTYPE.UNIONARENA;
}

// Filter functions for specific card types
export function filterUnionArenaCards(cards: GameCard[]): CardUnionArena[] {
  return cards.filter(isUnionArenaCard);
}

export function filterCookieRunCards(cards: GameCard[]): CookieRunCard[] {
  return cards.filter(isCookieRunCard);
}

export function filterDragonBallZCards(cards: GameCard[]): CardDragonBallZFW[] {
  return cards.filter(isDragonBallZCard);
}

export function filterDuelmastersCards(cards: GameCard[]): DuelmastersCard[] {
  return cards.filter(isDuelmastersCard);
}

export function filterOnePieceCards(cards: GameCard[]): CardOnePiece[] {
  return cards.filter(isOnePieceCard);
}

export function filterHololiveCards(cards: GameCard[]): HololiveCard[] {
  return cards.filter(isHololiveCard);
}

export function filterGundamCards(cards: GameCard[]): GundamCard[] {
  return cards.filter(isGundamCard);
}