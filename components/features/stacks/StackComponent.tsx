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

interface StacksComponentProps {
  post: DeckPost;
}

const StacksComponent = ({ post }: StacksComponentProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const sqlUser = useUserStore((state) => state.sqlUser);
  const isOwner = sqlUser?.userId === post.userId;
  const [isLiked, setIsLiked] = useState(
    sqlUser?.userId ? post.listoflikes.includes(sqlUser.userId) : false
  );

  useEffect(() => {
    setIsLiked(
      sqlUser?.userId ? post.listoflikes.includes(sqlUser.userId) : false
    );
  }, [post.listoflikes, sqlUser?.userId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!sqlUser?.userId) return; // Guard clause if no user

    const previousState = isLiked;
    setIsLiked(!previousState); // Optimistic update

    if (!post.postId) {
      console.error("Post ID is missing");
      return;
    }
    try {
      let success: boolean;

      if (previousState) {
        // Unlike the post
        const response = await userUnlikePost(post.postId);
        success = response.success;
      } else {
        // Like the post
        const response = await userLikePost(post.postId, sqlUser.userId);
        success = response.success;
      }

      if (!success) {
        setIsLiked(previousState); // Revert if API call failed
      }
    } catch (error) {
      setIsLiked(previousState); // Revert on network error
      console.error("Error toggling like:", error);
    }
  };
  const handleCommentPost = () => {
    console.log("comment clicked");
  };

  const handleSharePost = (e: any) => {
    e.stopPropagation();
    console.log("share clicked");
  };

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
      console.log("Post deletion confirmed");
    } else {
      // User clicked "Cancel"
      console.log("Post deletion cancelled");
    }
  };

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
                  onClick={handleLike}
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
            initial={{ opacity: 0 }}
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
                type: "spring",
                damping: 25, // Quick deceleration
                stiffness: 400, // Snappy movement
                mass: 0.5, // Lighter feeling
                bounce: 0.2, // Minimal overshoot
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DetailStack
                postDetails={post}
                onClose={() => setIsDetailOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StacksComponent;
