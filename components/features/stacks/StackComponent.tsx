import { Heart, MessageSquareText, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../../../styles/StacksPage.module.css";
import DetailStack from "./DetailStack";
import { DeckPost } from "../../../model/deckpost.model";
import { useUserStore } from "../../../services/store/user.store";
import {
  userDeletePost,
  userLikePost,
  userUnlikePost,
} from "../../../services/functions/gsUserPostService";
import { detailStackEvent } from "../../../services/eventBus/detailStackEvent";
import ShareContent from "./ShareContent";

interface StacksComponentProps {
  post: DeckPost;
}

const StacksComponent = ({ post }: StacksComponentProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const sqlUser = useUserStore((state) => state.sqlUser);
  const isOwner = sqlUser?.userId === post.userId;
  const [isLiked, setIsLiked] = useState(
    sqlUser?.userId ? post.listoflikes.includes(sqlUser.userId) : false
  );

  // Set initial liked state based on post likes and current user
  useEffect(() => {
    setIsLiked(
      sqlUser?.userId ? post.listoflikes.includes(sqlUser.userId) : false
    );
  }, [post.listoflikes, sqlUser?.userId]);

  // Handle api call and state update for liking a post
  const handleLike = async (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!sqlUser?.userId || !post.postId) return;

    const previousState = isLiked;
    setIsLiked(true); // Optimistic update

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

  const handleCommentPost = () => {
    console.log("comment clicked");
  };

  const handleSharePost = (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    setPostUrl(
      `${window.location.origin}/stacks/${post.postId}`
    );
    setIsShareOpen(true);
  };



  // Handle post deletion api call
  const handleDeletingPost = (
    e: React.MouseEvent,
    postId: string | undefined
  ) => {
    e.stopPropagation();
    if (!postId) {
      console.error("Post ID is missing for deletion");
      return;
    }

    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this post?")) {
      // User clicked "OK"
      userDeletePost(postId);
      detailStackEvent.emit("post:deleted");
    } else {
      // User clicked "Cancel"
      console.log("Post deletion cancelled");
    }
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
        onClick={() => setIsDetailOpen(true)}
      >
        <div className={styles["stacks-component-cover"]}>
          <img src={post.selectedCards[0].imageSrc} alt="deck" />
        </div>
        <div className={styles["stacks-component-content"]}>
          <div className={styles["user-info"]}>
            <img src={post.displaypic} alt="display picture" />
            <span>{post.name}</span>
          </div>
          <div className={styles["holder"]}>
            <div className={styles["stacks-component-headline"]}>
              <span>{post.headline}</span>
            </div>
            <div className={styles["stacks-component-functions"]}>
              <div>
                <Heart
                  onClick={isLiked ? handleUnlike : handleLike}
                  fill={isLiked ? "var(--gs-color-secondary)" : "none"}
                  stroke={
                    isLiked ? "var(--gs-color-secondary)" : "currentColor"
                  }
                  className={styles["likes-btn"]}
                />
                <MessageSquareText onClick={handleCommentPost} />
                <Share2 onClick={handleSharePost} />
              </div>
              {isOwner && (
                <div
                  className={styles["del-func"]}
                  onClick={(e) => handleDeletingPost(e, post.postId)}
                >
                  <X />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Stack with Framer Motion */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div
            className={styles.detailOverlay}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              className={styles.detailContainer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DetailStack
                postDetails={post}
                isLiked={isLiked}
                onClose={() => setIsDetailOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/**/}
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
