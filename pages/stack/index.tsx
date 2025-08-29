import Layout from "../../components/Layout";
import SearchBarStack from "../../components/features/stacks/SearchBarStack";
import StacksList from "../../components/features/stacks/StacksList";

const StacksPage = () => {
  return (
    <Layout title="Stacks" scrollable={false}>
      <SearchBarStack/>
      <StacksList />
    </Layout>
  );
};

export default StacksPage;
