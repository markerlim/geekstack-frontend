import { useDeck } from "../../../contexts/DeckContext";
import UnionArenaStats from "./DeckbarStats/UnionArenaStats"; // Import your TCG-specific components
import OnePieceStats from "./DeckbarStats/OnePieceStats";
import { TCGTYPE } from "../../../utils/constants";
import CookieRunStats from "./DeckbarStats/CookieRunStats";
import DuelmastersStats from "./DeckbarStats/DuelmastersStats";
import GundamStats from "./DeckbarStats/GundamStats";
import { GameCard } from "../../../model/card.model";

interface DeckbuilderStatsProps {
  tcg: string;
}

export interface GameCardStatsProps {
  cardlist: GameCard[];
}

const DeckbuilderStats = ({ tcg }:DeckbuilderStatsProps) => {
  const { cardlist } = useDeck();

  const renderStatsComponent = () => {
    switch (tcg?.toLowerCase()) {
      case TCGTYPE.UNIONARENA:
        return <UnionArenaStats cardlist={cardlist} />;
      case TCGTYPE.ONEPIECE:
        return <OnePieceStats cardlist={cardlist} />;
      case TCGTYPE.COOKIERUN:
        return <CookieRunStats cardlist={cardlist} />;
      case TCGTYPE.DUELMASTERS:
        return <DuelmastersStats cardlist={cardlist} />;
      case TCGTYPE.GUNDAM:
        return <GundamStats cardlist={cardlist} />;
      default:
        return <div>No stats available for this TCG</div>;
    }
  };

  return <div>{renderStatsComponent()}</div>;
};

export default DeckbuilderStats;
