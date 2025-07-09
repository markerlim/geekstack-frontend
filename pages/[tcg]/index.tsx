import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import BoosterList from "../../components/features/BoosterList";

const BoosterListPage = () => {
  const { tcg } = useRouter().query;
  return (
    <Layout title={`${tcg?.toString().toUpperCase()} Boosters`}>
      <BoosterList/>
    </Layout>
  );
};

export default BoosterListPage;
