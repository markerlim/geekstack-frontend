import React from "react";
import styles from "../../../styles/DeckbuildList.module.css";
import { useDeck } from "../../../contexts/DeckContext";
import { TCGTYPE } from "../../../utils/constants";
import { sortCards } from "../../../utils/cardSorting";

interface DecklistPreviewProps {
  tcg: TCGTYPE;
}
const DecklistPreview = ({ tcg }: DecklistPreviewProps) => {
  const { cardlist } = useDeck();

  return (
    <div className={styles.decklistPreviewContainer}>
      <code>PREVIEW</code>
      <div className={styles.decklistPreviewContent}>
        {sortCards(cardlist, tcg).map((card) => (
          <div key={card._id}>
            <img
              src={card.urlimage}
              alt={card.cardName}
              width={75}
              height={105}
            />
            <div>x{card.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecklistPreview;
