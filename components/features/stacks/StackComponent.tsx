import { Heart, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";
import { useUserStore } from "../../../services/store/user.store";
import {
  userLikePost,
  userUnlikePost,
} from "../../../services/functions/gsUserPostService";
import { detailStackEvent } from "../../../services/eventBus/detailStackEvent";
import ShareContent from "./ShareContent";
import { useRouter } from "next/router";
import { formatTimestamp } from "../../../utils/FormatDate";

interface StacksComponentProps {
  post: DeckPost;
}

const StacksComponent = ({ post }: StacksComponentProps) => {
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const sqlUser = useUserStore((state) => state.sqlUser);
  const [isLiked, setIsLiked] = useState(
    sqlUser?.userId ? post?.listoflikes?.includes(sqlUser.userId) : false
  );

  // Set initial liked state based on post likes and current user
  useEffect(() => {
    setIsLiked(
      sqlUser?.userId ? post?.listoflikes?.includes(sqlUser.userId) : false
    );
  }, [post.listoflikes, sqlUser?.userId]);

  // Handle api call and state update for liking a post
  const handleLike = async (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!sqlUser?.userId || !post.postId) return;

    const previousState = isLiked;
    setIsLiked(true);

    try {
      const response = await userLikePost(post.postId, sqlUser.userId);
      if (response.success) {
      } else {
        setIsLiked(previousState);
      }
    } catch (error) {
      setIsLiked(previousState);
      console.error("Error liking post:", error);
    }
  };

  // Handle api call and state update for unliking a post
  const handleUnlike = async (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!sqlUser?.userId || !post.postId) return;

    const previousState = isLiked;
    setIsLiked(false);

    try {
      const response = await userUnlikePost(post.postId);
      if (response.success) {
      } else {
        setIsLiked(previousState);
      }
    } catch (error) {
      setIsLiked(previousState);
      console.error("Error unliking post:", error);
    }
  };

  const handleSharePost = (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    setPostUrl(`${window.location.origin}/stacks/${post.postId}`);
    setIsShareOpen(true);
  };

  const handleOpenPost = () => {
    detailStackEvent.emit("post:opened", post.postId);
    router.push(`/stack/${post.postId}`, undefined, { shallow: true });
  };

  // Event listener for liking and unliking posts from detail stack
  useEffect(() => {
    const handleExternalLike = (eventPostId: string, userId: string) => {
      if (eventPostId === post.postId && userId === sqlUser?.userId) {
        handleLike({} as React.MouseEvent);
      }
    };

    const handleExternalUnlike = (eventPostId: string, userId: string) => {
      if (eventPostId === post.postId && userId === sqlUser?.userId) {
        handleUnlike({} as React.MouseEvent);
      }
    };

    const handleExternalShare = (eventPostId: string) => {
      if (eventPostId === post.postId) {
        handleSharePost({} as React.MouseEvent);
      }
    };

    detailStackEvent.on("post:liked", handleExternalLike);
    detailStackEvent.on("post:unliked", handleExternalUnlike);
    detailStackEvent.on("post:share", handleExternalShare);
    return () => {
      detailStackEvent.off("post:liked", handleExternalLike);
      detailStackEvent.off("post:unliked", handleExternalUnlike);
      detailStackEvent.off("post:share", handleExternalShare);
    };
  }, [post.postId, sqlUser?.userId]);

  return (
    <>
      <div
        className={styles["stacks-component"]}
        data-post-id={post.postId}
        onClick={handleOpenPost}
      >
        {post.selectedCover && (
          <div className={styles["stacks-component-cover"]}>
            <img src={post.selectedCover} alt="deck" />
          </div>
        )}
        <div className={styles["stacks-component-content"]}>
          <div className={styles["stacks-component-headline"]}>
            <span>{post.headline}</span>
          </div>
          <div className={styles["stacks-component-functions"]}>
            <div className={styles["user-info"]}>
              <img src={post.displaypic} alt="display picture" />
              <span>{post.name}</span>
            </div>
            <div>
              <Heart
                size={20}
                onClick={isLiked ? handleUnlike : handleLike}
                fill={isLiked ? "var(--gs-color-secondary)" : "none"}
                stroke={isLiked ? "var(--gs-color-secondary)" : "currentColor"}
                className={styles["likes-btn"]}
              />
              <Share2 size={20} onClick={handleSharePost} />
            </div>
          </div>
          <div className={styles["date"]}>
            <span>{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isShareOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className={styles.shareOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "#000",
                zIndex: 1002,
              }}
              onClick={() => setIsShareOpen(false)}
            />
            <motion.div
              className={styles.shareContentModal}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1003,
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                boxShadow: "0 -2px 16px rgba(0,0,0,0.1)",
              }}
            >
              {/* ShareContent Modal */}
              <ShareContent
                postUrl={postUrl}
                onClose={() => setIsShareOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StacksComponent;
