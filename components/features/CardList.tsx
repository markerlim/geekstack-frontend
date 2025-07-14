import { useRouter } from "next/router";
import styles from "../../styles/CardList.module.css";
import { GameCard } from "../../model/card.model";
import { useEffect, useState } from "react";
import { fetchCardsByTcg } from "../../services/functions/gsBoosterService";
import TcgImage from "../../components/TcgImage";
import FilterBar, { FilterSection } from "../../components/features/FilterBar";
import { processCardsByTCG } from "../../utils/CreateFilters";
import DeckbuilderCounter from "./deckbuilding/DeckbuilderCounter";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useDevice } from "../../contexts/DeviceContext";

const CardList = () => {
  const router = useRouter();
  const device = useDevice();
  const isDesktop = device === 'desktop';
  const { tcg, setType: rawSetType } = router.query;
  const setType = Array.isArray(rawSetType) ? rawSetType[0] : rawSetType;
  const base =
    router.pathname
      .replace(/\[.*?\]/g, "") // remove any [param] segments
      .replace(/\/+/g, "/") // replace double slashes with single
      .replace(/\/$/, "") + "/";
  const [isDeckbuilding, setIsDeckbuilding] = useState(false);
  const [cardList, setCardList] = useState<GameCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<GameCard[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterSections, setFilterSections] = useState<FilterSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    const pathSegments = router.asPath
      .split("/")
      .filter((segment) => segment !== "");
    pathSegments.pop();
    const newPath = `/${pathSegments.join("/")}`;
    router.push(newPath);
  };
  const handleFilterChange = (title: string) => (value: string | undefined) => {
    console.log(`Filter changed - ${title}:`, value); // Debug log
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === undefined || value === "") {
        delete newFilters[title.toLowerCase()];
      } else {
        newFilters[title.toLowerCase()] = value;
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (base.includes("deckbuilder")) {
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

  // Update filter sections when filters change
  useEffect(() => {
    if (cardList.length > 0) {
      const sections = processCardsByTCG(cardList, handleFilterChange, filters);
      setFilterSections(sections);
      filterSections.forEach((section) => {
        console.group;
        console.log(section.title);
        console.log(section.active);
        console.log(section.options);
        console.groupEnd;
      });
    }
  }, [cardList, filters]);

  useEffect(() => {
    if (typeof tcg === "string" && typeof setType === "string") {
      fetchCardsByTcg(tcg, setType)
        .then((data) => {
          console.log("Cards fetched:", data);
          setCardList(data);
          setFilteredCards(data); // Initialize filtered cards with all cards
          // Reset filters when new data is loaded
          setFilters({});
        })
        .catch(() => setError("Failed to load boosters"));
    }
  }, [tcg, setType]);

  return (
    <div className={styles["card-container"]}>
      <div className={`${styles["arrow-left"]} ${isDesktop ? styles["desktop-back"] : styles["mobile-back"]}`} onClick={handleBackClick}>
        <ChevronLeft/> {isDesktop ? <div>Back</div> : <></>}
      </div>
      {filterSections.length > 0 && (
        <FilterBar sections={filterSections} key={`filter-${tcg}-${setType}`} />
      )}
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
    </div>
  );
};

export default CardList;
