import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftStackCol from "./LeftStackCol";
import RightStackCol from "./RightStackCol";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";
import {
  fetchUserPost,
  fetchUserPostByType,
} from "../../../services/functions/gsUserPostService";
import { DiamondPlus } from "lucide-react";
import { useDevice } from "../../../contexts/DeviceContext";
import PostingStack from "./PostingStack";
import { TCGTYPE } from "../../../utils/constants";
import { tcgList } from "../../../data/tcgList";
import { formatFirstLetterCap } from "../../../utils/FormatText";

const StacksList = () => {
  const device = useDevice();
  const [tcg, setTcg] = useState(TCGTYPE.ALL);
  const [leftColumn, setLeftColumn] = useState<DeckPost[]>([]);
  const [rightColumn, setRightColumn] = useState<DeckPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPostingOpen, setIsPostingOpen] = useState(false);

  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const filterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePostingStack = () => {
    setIsPostingOpen(!isPostingOpen);
  };

  const buttonClass =
    device === "desktop"
      ? styles["create-post-desktop"]
      : styles["create-post-mobile"];

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

  const handleSelectTCG = async (tcgItem: TCGTYPE) => {
    // Immediately reset state
    setTcg(tcgItem);
    setCurrentPage(0);
    setLeftColumn([]);
    setRightColumn([]);
    setHasMore(true);
    setLoading(true);

    try {
      // Immediately fetch new posts
      const posts =
        tcgItem === TCGTYPE.ALL
          ? await fetchUserPost(0, POSTS_PER_PAGE)
          : await fetchUserPostByType(tcgItem, 0, POSTS_PER_PAGE);

      if (Array.isArray(posts)) {
        const left: DeckPost[] = [];
        const right: DeckPost[] = [];

        posts.forEach((item, index) => {
          if (index % 2 === 0) left.push(item);
          else right.push(item);
        });

        setLeftColumn(left);
        setRightColumn(right);
        setHasMore(posts.length >= POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load only on first render
  useEffect(() => {
    loadPosts(0, true);
  }, []);

  // Render for loading more post
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

  //Scroll up to hide filter and scroll down to show filter
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;

      // Determine scroll direction
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        if (isFilterVisible && scrollTop > 50) {
          // Only hide after some threshold
          setIsFilterVisible(false);
        }
      } else {
        // Scrolling up
        if (!isFilterVisible || scrollTop <= 50) {
          setIsFilterVisible(true);
        }
      }

      setLastScrollTop(scrollTop);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop, isFilterVisible]);

  return (
    <div className={styles["stack-container"]}>
      <motion.div
        className={styles["stacks-filter-select"]}
        initial={{ y: 0 }}
        animate={{
          y: isFilterVisible ? 0 : -100,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className={`${TCGTYPE.ALL === tcg && styles['active']}`} onClick={() => handleSelectTCG(TCGTYPE.ALL)}>
          All
        </div>
        {tcgList.map((tcgItem) => (
          <div key={tcgItem.tcg} className={`${tcgItem.tcg === tcg && styles['active']}`} onClick={() => handleSelectTCG(tcgItem.tcg)}>
            <code>{formatFirstLetterCap(tcgItem.tcg)}</code>
          </div>
        ))}
      </motion.div>
      <motion.div
        className={styles["stacks-list"]}
        ref={containerRef}
        initial={{ marginTop: -1 }}
        animate={{
          marginTop: isFilterVisible ? -1 : -55, // Adjust this value to match your filter height
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <LeftStackCol items={leftColumn} />
        <RightStackCol items={rightColumn} />
        <button className={buttonClass} onClick={togglePostingStack}>
          <DiamondPlus />
          {device === "desktop" && <span>Create Post</span>}
        </button>
      </motion.div>
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
    </div>
  );
};

export default StacksList;
