import AllDecks from "../../components/features/listofdecks/allDecks";
import Layout from "../../components/Layout";

const DeckLib = () => {
    
  return (
    <Layout title="Deck Library | GeekStack"  scrollable={false}>
      <AllDecks/>
    </Layout>
  );
}

export default DeckLib;