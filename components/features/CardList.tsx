import { useRouter } from "next/router";
import styles from "../../styles/CardList.module.css";
import { GameCard } from "../../model/card.model";
import { useEffect, useState } from "react";
import { fetchCardsByTcg } from "../../services/functions/gsBoosterService";
import TcgImage from "../../components/TcgImage";
import FilterBar, {
  FilterSection,
} from "../../components/features/FilterBar";
import { processCardsByTCG } from "../../utils/CreateFilters";
import DeckbuilderCounter from "./deckbuilding/DeckbuilderCounter";

const CardList = () => {
  const { tcg, setType: rawSetType } = useRouter().query;
  const setType = Array.isArray(rawSetType) ? rawSetType[0] : rawSetType;
  const base =
    useRouter()
      .pathname.replace(/\[.*?\]/g, "") // remove any [param] segments
      .replace(/\/+/g, "/") // replace double slashes with single
      .replace(/\/$/, "") + "/";
      console.log(base)
  const [isDeckbuilding, setIsDeckbuilding] = useState(false);
  const [cardList, setCardList] = useState<GameCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<GameCard[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterSections, setFilterSections] = useState<FilterSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (title: string) => (value: string) => {
    setFilters((prev) => ({ ...prev, [title.toLowerCase()]: value }));
  };

  useEffect(() => {
    if (base.includes("deckbuilder")){
      setIsDeckbuilding(true);
    } else {
      setIsDeckbuilding(false);
    }
  }, [base]);

  useEffect(() => {
    if (cardList.length > 0) {
      let filtered = [...cardList];

      // Apply each active filter
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter(
            (card) =>
              String(card[key as keyof GameCard]).toLowerCase() ===
              value.toLowerCase()
          );
        }
      });

      setFilteredCards(filtered);
    }
  }, [filters, cardList]);

  useEffect(() => {
    if (typeof tcg === "string" && typeof setType === "string") {
      fetchCardsByTcg(tcg, setType)
        .then((data) => {
          console.log("Cards fetched:", data);
          const sections = processCardsByTCG(data, handleFilterChange, filters);
          setFilterSections(sections);
          setCardList(data);
          setFilteredCards(data); // Initialize filtered cards with all cards
        })
        .catch(() => setError("Failed to load boosters"));
    }
  }, [tcg, setType]);

  return (
    <>
      {filterSections.length > 0 && <FilterBar sections={filterSections} />}
      <div className={styles["card-list"]}>
        {filteredCards.map((card) => (
          <div key={card._id} className={styles["card-item"]}>
            <TcgImage
              src={card.urlimage}
              alt={card.cardName}
              tcgtype={Array.isArray(tcg) ? tcg[0] : tcg}
              card={card}
            />
            {isDeckbuilding && <DeckbuilderCounter card={card} />}
          </div>
        ))}
      </div>
    </>
  );
};

export default CardList;
