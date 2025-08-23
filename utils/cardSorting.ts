import { GameCard } from "../model/card.model";
import { TCGTYPE } from "../utils/constants";
import {
  isUnionArenaCard,
  isCookieRunCard,
  isDragonBallZCard,
  isDuelmastersCard,
  isOnePieceCard,
  isHololiveCard,
  isGundamCard,
} from "../model/cardTypeGuards";

export const sortCards = (cards: GameCard[], tcgType: TCGTYPE): GameCard[] => {
  const sortedCards = [...cards];
  switch (tcgType) {
    case TCGTYPE.UNIONARENA:
      return sortUnionArenaCards(sortedCards);

    case TCGTYPE.ONEPIECE:
      return sortOnePieceCards(sortedCards);

    case TCGTYPE.COOKIERUN:
      return sortCookieRunCards(sortedCards);

    case TCGTYPE.DUELMASTERS:
      return sortDuelMastersCards(sortedCards);

    case TCGTYPE.DRAGONBALLZFW:
      return sortDragonBallZCards(sortedCards);

    case TCGTYPE.GUNDAM:
      return sortGundamCards(sortedCards);

    case TCGTYPE.HOLOLIVE:
      return sortHololiveCards(sortedCards);

    default:
      return sortDefaultCards(sortedCards);
  }
};

const sortUnionArenaCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isUnionArenaCard(a) && isUnionArenaCard(b)) {
      const categoryA = a.category ?? "";
      const categoryB = b.category ?? "";

      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB);
      }

      const energyCostA = a.energycost ?? 0;
      const energyCostB = b.energycost ?? 0;

      if (energyCostA !== energyCostB) {
        return energyCostA - energyCostB;
      }

      const nameA = a.cardName ?? "";
      const nameB = b.cardName ?? "";
      return nameA.localeCompare(nameB);
    }

    return 0;
  });
};

const sortOnePieceCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isOnePieceCard(a) && isOnePieceCard(b)) {
      // One Piece TCG: Cost -> Category -> Power -> Card Name
      const costA = a.lifecost ? parseInt(a.lifecost) : 0;
      const costB = b.lifecost ? parseInt(b.lifecost) : 0;

      if (costA !== costB) {
        return costA - costB;
      }

      const categoryA = a.category ?? "";
      const categoryB = b.category ?? "";

      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB);
      }

      const powerA = a.power ? parseInt(a.power) : 0;
      const powerB = b.power ? parseInt(b.power) : 0;

      if (powerA !== powerB) {
        return powerB - powerA; // Higher power first
      }

      const nameA = a.cardName ?? "";
      const nameB = b.cardName ?? "";
      return nameA.localeCompare(nameB);
    }

    return 0;
  });
};

const sortCookieRunCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isCookieRunCard(a) && isCookieRunCard(b)) {
      const typeA = a.cardType ?? "";
      const typeB = b.cardType ?? "";

      if (typeA !== typeB) {
        return typeA.localeCompare(typeB);
      }
      const costA = parseInt(a.cardLevelTitle) ?? 0;
      const costB = parseInt(b.cardLevelTitle) ?? 0;

      if (costA !== costB) {
        return costA - costB;
      }
    }

    return 0;
  });
};

const sortDuelMastersCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isDuelmastersCard(a) && isDuelmastersCard(b)) {
      const typeA = a.type ?? "";
      const typeB = b.type ?? "";

      if (typeA !== typeB) {
        return typeA.localeCompare(typeB);
      }

      const manaCostA = parseInt(a.mana) ?? 0;
      const manaCostB = parseInt(b.mana) ?? 0;

      if (manaCostA !== manaCostB) {
        return manaCostA - manaCostB;
      }
    }

    return 0;
  });
};

const sortDragonBallZCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isDragonBallZCard(a) && isDragonBallZCard(b)) {
      const typeA = a.cardtypeLower ?? "";
      const typeB = b.cardtypeLower ?? "";

      if (typeA !== typeB) {
        return typeA.localeCompare(typeB);
      }

      const energyCostA = parseInt(a.cost) ?? 0;
      const energyCostB = parseInt(b.cost) ?? 0;

      if (energyCostA !== energyCostB) {
        return energyCostA - energyCostB;
      }

      const nameA = a.cardName ?? "";
      const nameB = b.cardName ?? "";
      return nameA.localeCompare(nameB);
    }

    return 0;
  });
};

const sortGundamCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isGundamCard(a) && isGundamCard(b)) {
      const typeA = a.cardType ?? "";
      const typeB = b.cardType ?? "";

      if (typeA !== typeB) {
        return typeA.localeCompare(typeB);
      }

      const costA = parseInt(a.cost) ?? 0;
      const costB = parseInt(b.cost) ?? 0;

      if (costA !== costB) {
        return costA - costB;
      }

      const nameA = a.cardName ?? "";
      const nameB = b.cardName ?? "";
      return nameA.localeCompare(nameB);
    }

    return 0;
  });
};

const sortHololiveCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    if (isHololiveCard(a) && isHololiveCard(b)) {
      const nameA = a.cardName ?? "";
      const nameB = b.cardName ?? "";
      return nameA.localeCompare(nameB);
    }

    return 0;
  });
};

const sortDefaultCards = (cards: GameCard[]): GameCard[] => {
  return cards.sort((a, b) => {
    // Default sorting by card name
    const nameA = a.cardName ?? "";
    const nameB = b.cardName ?? "";
    return nameA.localeCompare(nameB);
  });
};
