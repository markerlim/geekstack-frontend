import { useState, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import styles from '../styles/Searchbar.module.css';
import { TCGListItem } from '../data/tcgList';
import { useSearchCards } from '../contexts/SearchContext';

interface SearchBarProps {
  games: TCGListItem[];
  initialGame: TCGListItem;
}

const SearchBar = ({ games, initialGame }: SearchBarProps) => {
  const { searchCards, clearSearch } = useSearchCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<TCGListItem>(initialGame || games[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCards(searchTerm, selectedGame.tcg);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    clearSearch();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectGame = (game: TCGListItem) => {
    setSelectedGame(game);
    setIsDropdownOpen(false);
    if (searchTerm.trim()) {
      searchCards(searchTerm, game.tcg);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Geekstack"
        />
        
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div 
            className={`${styles.customDropdown} ${isDropdownOpen ? styles.active : ''}`}
            onClick={toggleDropdown}
          >
            <div className={styles.selectedOption}>
              <img 
                src={selectedGame.icon} 
                alt={selectedGame.alt} 
                className={styles.gameIcon}
              />
              <ChevronDown className={styles.dropdownChevron} />
            </div>
            
            {isDropdownOpen && (
              <ul 
                className={styles.dropdownOptions} 
                onClick={(e) => e.stopPropagation()}
              >
                {games.map((game) => (
                  <li 
                    key={game.tcg} 
                    className={styles.gameOption}
                    onClick={() => selectGame(game)}
                  >
                    <img 
                      src={game.icon} 
                      alt={game.alt} 
                      className={styles.gameIcon}
                    />
                    <code className={styles.gameCode}>{game.tcg.toUpperCase()}</code>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {searchTerm && (
        <>
        <button 
          type="button" 
          title="Clear search"
          className={styles.clearBtn} 
          onClick={handleClear}
        >
          <X size={16} />
        </button>
        </>
      )}
    </div>
  );
};

export default SearchBar;