import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftStackCol from "./LeftStackCol";
import RightStackCol from "./RightStackCol";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";
import { fetchUserPost } from "../../../services/functions/gsUserPostService";
import { DiamondPlus } from "lucide-react";
import { useDevice } from "../../../contexts/DeviceContext";
import PostingStack from "./PostingStack";

const StacksList = () => {
  const device = useDevice();
  const [leftColumn, setLeftColumn] = useState<DeckPost[]>([]);
  const [rightColumn, setRightColumn] = useState<DeckPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPostingOpen, setIsPostingOpen] = useState(false);

  const togglePostingStack = () => {
    setIsPostingOpen(!isPostingOpen);
  };

  const buttonClass =
    device === "desktop"
      ? styles["create-post-desktop"]
      : styles["create-post-mobile"];

  const containerRef = useRef<HTMLDivElement>(null);

  const POSTS_PER_PAGE = 20;

  const loadPosts = useCallback(
    async (page: number, isInitial = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const posts = await fetchUserPost(page, POSTS_PER_PAGE);

        if (Array.isArray(posts)) {
          // If we get fewer posts than requested, we've reached the end
          if (posts.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }

          const left: DeckPost[] = [];
          const right: DeckPost[] = [];

          posts.forEach((item, index) => {
            // Calculate the actual index considering all loaded posts
            const actualIndex = page * POSTS_PER_PAGE + index;
            if (actualIndex % 2 === 0) {
              left.push(item);
            } else {
              right.push(item);
            }
          });

          if (isInitial) {
            setLeftColumn(left);
            setRightColumn(right);
          } else {
            setLeftColumn((prev) => [...prev, ...left]);
            setRightColumn((prev) => [...prev, ...right]);
          }
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Initial load
  useEffect(() => {
    loadPosts(0, true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isFetching = false;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

      if (loading || !hasMore || isFetching) return;

      if (distanceToBottom < 500) {
        isFetching = true;
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadPosts(nextPage).finally(() => {
          isFetching = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentPage, loading, hasMore, loadPosts]);

  return (
    <>
      <div className={styles["stacks-list"]} ref={containerRef}>
        <LeftStackCol items={leftColumn} />
        <RightStackCol items={rightColumn} />
        <button className={buttonClass} onClick={togglePostingStack}>
          <DiamondPlus />
          {device === "desktop" && <span>Create Post</span>}
        </button>
      </div>
      <AnimatePresence>
        {isPostingOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.backdrop}
              onClick={togglePostingStack}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={styles.postingStackWrapper}
            >
              <PostingStack onClose={togglePostingStack} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StacksList;
