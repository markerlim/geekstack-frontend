import { useRouter } from "next/router";
import styles from "../../styles/CardList.module.css";
import { GameCard } from "../../model/card.model";
import { useCallback, useEffect, useState } from "react";
import { fetchCardsByTcg } from "../../services/functions/gsBoosterService";
import FilterBar, { FilterSection } from "../../components/features/FilterBar";
import { processCardsByTCG } from "../../utils/CreateFilters";
import DeckbuilderCounter from "./deckbuilding/DeckbuilderCounter";
import { ChevronLeft } from "lucide-react";
import { useDevice } from "../../contexts/DeviceContext";
import cardNavEvent from "../../services/eventBus/cardNavEvent";
import { TcgImageDetails } from "../TcgImageDetails";
import TcgImage from "../TcgImage";

const CardList = () => {
  const router = useRouter();
  const device = useDevice();
  const isDesktop = device === "desktop";
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
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
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

  const handleCardClick = (card: GameCard) => {
    setCurrentCard(card);
    cardNavEvent.emit("card:open", card._id);
  };

  const handleCloseModal = () => {
    setCurrentCard(null);
    cardNavEvent.emit("card:close");
  };

  // Card navigation
  const navigateToAdjacentCard = useCallback(
    (direction: "next" | "prev") => {
      if (!currentCard || filteredCards.length === 0) return;

      const currentIndex = filteredCards.findIndex(
        (c) => c._id === currentCard._id
      );
      if (currentIndex === -1) return;

      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % filteredCards.length
          : (currentIndex - 1 + filteredCards.length) % filteredCards.length;

      setCurrentCard(filteredCards[newIndex]);
    },
    [currentCard, filteredCards]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigateToAdjacentCard("next");
    },
    [navigateToAdjacentCard]
  );

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigateToAdjacentCard("prev");
    },
    [navigateToAdjacentCard]
  );

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (e.key === "ArrowRight") navigateToAdjacentCard("next");
      if (e.key === "ArrowLeft") navigateToAdjacentCard("prev");
      if (e.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCard, navigateToAdjacentCard]);

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
          setCardList(data);
          setFilteredCards(data);
          setFilters({});
        })
        .catch(() => setError("Failed to load boosters"));
    }
  }, [tcg, setType]);

  return (
    <div className={styles["card-container"]}>
      <div
        className={`${styles["arrow-left"]} ${
          isDesktop ? styles["desktop-back"] : styles["mobile-back"]
        }`}
        onClick={handleBackClick}
      >
        <ChevronLeft /> {isDesktop ? <div>Back</div> : <></>}
      </div>
      {filterSections.length > 0 && (
        <FilterBar sections={filterSections} key={`filter-${tcg}-${setType}`} />
      )}
      <div className={styles["card-list"]}>
        {filteredCards.map((card, index) => (
          <div key={card._id} className={styles["card-item"]}>
            <TcgImage
              src={card.urlimage}
              alt={card.cardName}
              tcgtype={Array.isArray(tcg) ? tcg[0] : tcg}
              card={card}
              onClick={() => handleCardClick(card)}
            />
            {isDeckbuilding && <DeckbuilderCounter card={card} />}
          </div>
        ))}
      </div>
        <TcgImageDetails
          card={currentCard}
          tcgtype={Array.isArray(tcg) ? tcg[0] : tcg || ""}
          imgProps={{
            src: currentCard?.urlimage,
            alt: currentCard?.cardName,
          }}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
        />
    </div>
  );
};

export default CardList;
