import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import StacksList from "../../components/features/stacks/StacksList";
import DetailStack from "../../components/features/stacks/DetailStack";
import styles from "../../styles/StacksPage.module.css";
import { DeckPost } from "../../model/deckpost.model";
import { fetchUserPostById } from "../../services/functions/gsUserPostService";
import { useUserStore } from "../../services/store/user.store";

const StacksPage = () => {
  const router = useRouter();
  const { deckuid } = router.query;
  const {sqlUser} = useUserStore();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [post, setPost] = useState<DeckPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!deckuid) {
        setIsDetailOpen(false);
        setPost(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsDetailOpen(true);

      const { data, error } = await fetchUserPostById(deckuid as string);
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

  const handleClose = () => {
    router.push("/stacks", undefined, { shallow: true });
    setIsDetailOpen(false);
  };

  return (
    <Layout title="Stacks" scrollable={false}>
      <StacksList />
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div
            className={styles.detailOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={styles.detailContainer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                mass: 0.5,
                bounce: 0.2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className={styles.errorMessage}>
                  {error}
                  <button 
                    onClick={handleClose}
                    className={styles.closeButton}
                  >
                    Close
                  </button>
                </div>
              ) : post ? (
                <DetailStack
                  postDetails={post}
                  isLiked={post.listoflikes.includes(sqlUser?.userId || "") || false} // Replace with actual user ID
                  onClose={handleClose}
                />
              ) : (
                <div>No data found</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default StacksPage;
