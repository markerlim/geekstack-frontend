import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../services/store/user.store";
import { DeckPost } from "../../../model/deckpost.model";
import { fetchUserPostById } from "../../../services/functions/gsUserPostService";
import DetailStackPage from "../../../components/features/stacks/DetailStackPage";
import CardLoader from "../../../components/genericComponent/CardLoader";

const StacksDetailPage = () => {
  const router = useRouter();
  const { deckuid } = router.query;
  const { sqlUser } = useUserStore();
  const [post, setPost] = useState<DeckPost>({} as DeckPost);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    router.push("/stack");
  };

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await fetchUserPostById(deckuid as string);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (error) {
        setError(error);
      } else if (data) {
        setPost(data);
      }

      setIsLoading(false);
    };

    if (router.isReady) {
      fetchPost();
    }
  }, [deckuid, router.isReady]);

  return (
    <Layout title={`Stacks | ${deckuid}`} scrollable={false}>
      {isLoading ? (
        <div style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <CardLoader />
        </div>
      ) : (
        <DetailStackPage
          postDetails={post}
          isLiked={post?.listoflikes?.includes(sqlUser?.userId || "") || false}
          onClose={handleClose}
        />
      )}
    </Layout>
  );
};

export default StacksDetailPage;
