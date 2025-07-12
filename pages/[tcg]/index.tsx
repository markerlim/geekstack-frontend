import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import BoosterList from "../../components/features/BoosterList";
import { useSearchCards } from "../../contexts/SearchContext";
import { useState } from "react";
import SearchContainer from "../../components/features/search/SearchContainer";
import SearchResModal from "../../components/features/search/SearchResModal";

const BoosterListPage = () => {
  const { tcg } = useRouter().query;
   const { searchResults } = useSearchCards();
    const [expandedResults, setExpandedResults] = useState(false);
  
    const handleSearchResultsClosed = () => {
      setExpandedResults(false);
    };
  
    const handleSearchCardOpen = () => {
      setExpandedResults(true);
    };
  
  return (
    <Layout title={`${tcg?.toString().toUpperCase()} Boosters`} scrollable={false}>
      {searchResults ? (
        <SearchContainer onOpen={handleSearchCardOpen} />
      ) : (
        <BoosterList />
      )}
      {expandedResults && (
          <SearchResModal
            onClose={handleSearchResultsClosed}
          />
        )}
    </Layout>
  );
};

export default BoosterListPage;
