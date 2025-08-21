import AccountComponent from "../../components/features/account/AccountComponent";
import Layout from "../../components/Layout";

const AccountPage = () => {
  return (
    <Layout title="Account | GeekStack" scrollable={false}>
      <AccountComponent/>
    </Layout>
  );
};

export default AccountPage;
