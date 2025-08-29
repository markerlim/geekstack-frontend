import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
} from "framer-motion";
import LeftStackCol from "./LeftStackCol";
import RightStackCol from "./RightStackCol";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";
import {
  fetchUserPost,
  fetchUserPostBySearch,
  fetchUserPostByType,
} from "../../../services/functions/gsUserPostService";
import { DiamondPlus } from "lucide-react";
import { useDevice } from "../../../contexts/DeviceContext";
import PostingStack from "./PostingStack";
import { TCGTYPE } from "../../../utils/constants";
import { tcgList } from "../../../data/tcgList";
import { formatFirstLetterCap } from "../../../utils/FormatText";
import { detailStackEvent } from "../../../services/eventBus/detailStackEvent";
import { useRouter } from "next/router";
import CardLoader from "../../genericComponent/CardLoader";
import searchPostEvent from "../../../services/eventBus/searchPostEvent";

interface StacksScrollState {
  lastViewedPostId: string | null;
  leftColumn: DeckPost[];
  rightColumn: DeckPost[];
  currentPage: number;
  hasMore: boolean;
  tcg: TCGTYPE;
  isStateRestored: boolean;
  searchTerm: string;
}

const StacksList = () => {
  const router = useRouter();
  const device = useDevice();
  const all = "all" as TCGTYPE;
  const [tcg, setTcg] = useState(all);
  const [leftColumn, setLeftColumn] = useState<DeckPost[]>([]);
  const [rightColumn, setRightColumn] = useState<DeckPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPostingOpen, setIsPostingOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [savedLastViewedId, setSavedLastViewedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isRestoringState = useRef(false);
  const hasRestoredState = useRef(false);
  const paginationLock = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const POSTS_PER_PAGE = 20;

  useEffect(() => {
    const handleRouteChange = () => {
      if (isInitialized) {
        const savedState = sessionStorage.getItem("stacksScrollState");
        let lastViewedPostId: string | null = null;

        if (savedState) {
          try {
            const parsed = JSON.parse(savedState) as StacksScrollState;
            lastViewedPostId = parsed.lastViewedPostId ?? null;
          } catch {}
        }

        const state: StacksScrollState = {
          lastViewedPostId,
          leftColumn,
          rightColumn,
          currentPage,
          hasMore,
          tcg,
          isStateRestored: true,
          searchTerm,
        };

        sessionStorage.setItem("stacksScrollState", JSON.stringify(state));
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [
    router,
    leftColumn,
    rightColumn,
    currentPage,
    hasMore,
    tcg,
    isInitialized,
    searchTerm,
  ]);

  // Load posts function - handles both normal loading and TCG filtering
  const loadPosts = useCallback(
    async (
      page: number,
      isInitial = false,
      targetTcg: TCGTYPE = tcg,
      targetSearchTerm: string = searchTerm,
      skipIfExists = false
    ) => {
      if (paginationLock.current || isRestoringState.current) {
        return;
      }

      if (skipIfExists && (leftColumn.length > 0 || rightColumn.length > 0)) {
        return;
      }

      paginationLock.current = true;
      setLoading(true);

      try {
        let posts;
        if (targetSearchTerm) {
          posts = await fetchUserPostBySearch(
            targetSearchTerm,
            page,
            POSTS_PER_PAGE
          );
        } else {
          posts =
            targetTcg === all
              ? await fetchUserPost(page, POSTS_PER_PAGE)
              : await fetchUserPostByType(targetTcg, page, POSTS_PER_PAGE);
        }

        if (Array.isArray(posts)) {
          // Check if we have more data
          if (posts.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }

          const left: DeckPost[] = [];
          const right: DeckPost[] = [];

          posts.forEach((item, index) => {
            const actualIndex = page * POSTS_PER_PAGE + index;
            if (actualIndex % 2 === 0) {
              left.push(item);
            } else {
              right.push(item);
            }
          });
          
          await new Promise((resolve) => setTimeout(resolve, 500));
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
        paginationLock.current = false;
      }
    },
    [tcg, searchTerm, leftColumn.length, rightColumn.length]
  );

  // Initialize component - handle state restoration or fresh load
  useEffect(() => {
    if (isInitialized) return;

    const initializeComponent = async () => {
      const savedState = sessionStorage.getItem("stacksScrollState");

      if (savedState) {
        try {
          const state: StacksScrollState = JSON.parse(savedState);

          if (state.isStateRestored && state.leftColumn.length > 0) {
            isRestoringState.current = true;
            hasRestoredState.current = true;

            // Restore all state except scroll position
            setTcg(state.tcg);
            setLeftColumn(state.leftColumn);
            setRightColumn(state.rightColumn);
            setCurrentPage(state.currentPage);
            setHasMore(state.hasMore);
            setSearchTerm(state.searchTerm || "");
            setSavedLastViewedId(state.lastViewedPostId as string);
            setTimeout(() => {
              sessionStorage.removeItem("stacksScrollState");

              setTimeout(() => {
                isRestoringState.current = false;
                setIsInitialized(true);
              }, 200);
            }, 500);

            return;
          }
        } catch (error) {
          console.error("Error parsing saved state:", error);
          sessionStorage.removeItem("stacksScrollState");
        }
      }

      hasRestoredState.current = false;
      await loadPosts(0, true, tcg, searchTerm, false);
      setIsInitialized(true);
    };

    initializeComponent();
  }, [loadPosts, tcg, isInitialized]);

  useEffect(() => {
    if (isInitialized && containerRef.current && savedLastViewedId) {
      console.log("Now jumping to", savedLastViewedId);
      handleJumpToContent(savedLastViewedId);
    }
  }, [isInitialized, containerRef.current]);

  // Infinite scroll pagination
  useEffect(() => {
    if (!isInitialized || isRestoringState.current || loading) return;

    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (
          isRestoringState.current ||
          paginationLock.current ||
          !hasMore ||
          loading
        ) {
          return;
        }

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceToBottom < 200) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          loadPosts(nextPage, false, tcg, searchTerm);
        }
      }, 150); // Reduced debounce time
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentPage, hasMore, loading, loadPosts, tcg, isInitialized, searchTerm]);

  const handleOpenPosting = () => {
    setIsPostingOpen(true);
  };

  const handleClosePosting = () => {
    setIsPostingOpen(false);
  };

  const buttonClass =
    device === "desktop"
      ? styles["create-post-desktop"]
      : styles["create-post-mobile"];

  const handleSelectTCG = async (tcgItem: TCGTYPE) => {
    // Clear saved state when filter changes
    sessionStorage.removeItem("stacksScrollState");
    hasRestoredState.current = false;

    setTcg(tcgItem);
    setCurrentPage(0);
    setLeftColumn([]);
    setRightColumn([]);
    setSearchTerm("");
    setHasMore(true);

    await loadPosts(0, true, tcgItem, "");
  };

  useEffect(() => {
    const handleDetailStack = (post: string) => {
      console.log("POST: ", post);
      const state: StacksScrollState = {
        lastViewedPostId: post,
        leftColumn,
        rightColumn,
        currentPage,
        hasMore,
        tcg,
        isStateRestored: true,
        searchTerm,
      };
      sessionStorage.setItem("stacksScrollState", JSON.stringify(state));
    };

    detailStackEvent.on("post:opened", handleDetailStack);
    return () => {
      detailStackEvent.off("post:opened", handleDetailStack);
    };
  }, [leftColumn, rightColumn, currentPage, hasMore, tcg, searchTerm]);

  const handleJumpToContent = (postId: string) => {
    console.log("jumping to ", postId);
    const contentSection = document.querySelector(
      `[data-post-id="${postId}"]`
    ) as HTMLElement | null;

    const container = containerRef.current;

    if (contentSection && container) {
      const offsetTop =
        contentSection.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;

      container.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const reloadPosts = async () => {
      sessionStorage.removeItem("stacksScrollState");
      hasRestoredState.current = false;
      setCurrentPage(0);
      setLeftColumn([]);
      setRightColumn([]);
      setHasMore(true);
      setSearchTerm("");
      await loadPosts(0, true, tcg, "");
    };

    detailStackEvent.on("post:created", reloadPosts);
    detailStackEvent.on("post:deleted", reloadPosts);

    return () => {
      detailStackEvent.off("post:created", reloadPosts);
      detailStackEvent.off("post:deleted", reloadPosts);
    };
  }, [tcg, loadPosts]);

  // Fixed search handling with debounce
  useEffect(() => {
    if (!isInitialized) return;
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      // Reset before search
      setLeftColumn([]);
      setRightColumn([]);
      setCurrentPage(0);
      setHasMore(true);
      
      // Trigger new search with current searchTerm
      loadPosts(0, true, tcg, searchTerm, false);
    }, 300); // 300ms debounce
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, isInitialized]);

  // Filter visibility handling
  useEffect(() => {
    if (!isInitialized || isRestoringState.current) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isRestoringState.current) return;

      const scrollTop = container.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 50) {
        if (isFilterVisible) {
          setIsFilterVisible(false);
        }
      } else if (scrollTop < lastScrollTop || scrollTop <= 50) {
        if (!isFilterVisible) {
          setIsFilterVisible(true);
        }
      }

      setLastScrollTop(scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop, isFilterVisible, isInitialized]);

  useEffect(() => {
    const handleSearch = (term: string) => {
      setSearchTerm(term);
    };

    searchPostEvent.on("search:query", handleSearch);
    return () => {
      searchPostEvent.off("search:query", handleSearch);
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className={styles["stack-container"]}>
        <div className={styles["stacks-list"]}>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <CardLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["stack-container"]}>
      <motion.div
        className={styles["stacks-filter-select"]}
        initial={{ height: 50, borderBottom: "var(--gs-border)" }}
        animate={{
          height: isFilterVisible ? 50 : 0,
          borderBottom: isFilterVisible ? "var(--gs-border)" : "none",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div
          className={`${all === tcg && styles["active"]}`}
          onClick={() => handleSelectTCG(all)}
        >
          All
        </div>
        {tcgList.map((tcgItem) => (
          <div
            key={tcgItem.tcg}
            className={`${tcgItem.tcg === tcg && styles["active"]}`}
            onClick={() => handleSelectTCG(tcgItem.tcg)}
          >
            <code>{formatFirstLetterCap(tcgItem.tcg)}</code>
          </div>
        ))}
      </motion.div>
      <div className={styles["stacks-list"]} ref={containerRef}>
        <div className={styles["stacks-column"]}>
          <LeftStackCol items={leftColumn} />
          <RightStackCol items={rightColumn} />
        </div>

        <div className={styles["stacks-list-loader"]}>
          {loading && <CardLoader />}
        </div>
        <button className={buttonClass} onClick={handleOpenPosting}>
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
              onClick={handleOpenPosting}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={styles.postingStackWrapper}
            >
              <PostingStack onClose={handleClosePosting} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StacksList;