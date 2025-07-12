import { createContext, useContext, useState, ReactNode } from 'react';
import { GameCard } from '../model/card.model';
import { searchForCard } from '../services/functions/gsBoosterService';

interface SearchContextType {
  searchTerm: string;
  searchResults: GameCard[] | null;
  isLoading: boolean;
  error: string | null;
  searchCards: (term: string, tcg: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GameCard[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCards = async (term: string, tcg: string) => {
    if (!term.trim()) {
      clearSearch();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchTerm(term);

    try {
      const response = await searchForCard(term,tcg);
      setSearchResults(response);
    } catch (err) {
      setError('Failed to fetch cards');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    setError(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        searchResults,
        isLoading,
        error,
        searchCards,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchCards = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchCards must be used within a SearchProvider');
  }
  return context;
};