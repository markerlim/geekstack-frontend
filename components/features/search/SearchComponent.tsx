import { ChevronLeft } from "lucide-react";
import { TCGListItem } from "../../../data/tcgList";
import SearchBar from "../../SearchBar";
import SearchResModal from "./SearchResModal";
import { useState } from "react";
import styles from "../../../styles/SearchComponent.module.css";
import SearchContainer from "./SearchContainer";
import { useSearchCards } from "../../../contexts/SearchContext";

interface SearchComponentProps {
  tcgList: TCGListItem[];
  initialGame: TCGListItem;
  onClose: () => void;
}
const SearchComponent = ({
  tcgList,
  initialGame,
  onClose,
}: SearchComponentProps) => {
  const { clearSearch } = useSearchCards();
  const [expandedResults, setExpandedResults] = useState(false);

  const completeClose = () => {
    clearSearch();
    onClose();
  };
  const handleSearchResultsClosed = () => {
    setExpandedResults(false);
  };

  const handleSearchCardOpen = () => {
    setExpandedResults(true);
  };
  return (
    <div className={styles.searchMain}>
      <div className={styles.searchFuncHolder}>
        <ChevronLeft onClick={completeClose} className={styles.backButton}/>
        <SearchBar
          games={tcgList}
          initialGame={initialGame}
          key={initialGame.tcg}
        />
      </div>
      <SearchContainer onOpen={handleSearchCardOpen} />
      {expandedResults && (
        <SearchResModal onClose={handleSearchResultsClosed} />
      )}
    </div>
  );
};

export default SearchComponent;
