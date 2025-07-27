import { X } from "lucide-react";
import styles from "../../../styles/IndexPage.module.css";
import { useSearchCards } from "../../../contexts/SearchContext";
import { TcgImage } from "../../TcgImage";

const SearchResModal = ({onClose}) => {
  const { searchResults, searchTerm } = useSearchCards();

  return (
    <div className={styles.resultsModal}>
      <div className={styles.modalHeader}>
        <h3>Search Results for "{searchTerm}"</h3>
        <button
          title="Expand results"
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={24} />
        </button>
      </div>
      <div className={styles.modalResults}>
        {searchResults?.map((card) => (
          <div key={card._id}>
            <TcgImage
              card={card}
              tcgtype={card.tcg}
              src={card.urlimage}
              alt={card.cardName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResModal;
