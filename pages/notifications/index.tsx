import ListOfNotifications from "../../components/features/notifications/ListOfNotifications";
import Layout from "../../components/Layout";

const DeckLib = () => {
    
  return (
    <Layout title="Deck Library | GeekStack"  scrollable={false}>
      <ListOfNotifications isComponent={false}/>
    </Layout>
  );
}

export default DeckLib;