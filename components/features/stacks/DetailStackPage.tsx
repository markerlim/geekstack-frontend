import {
  ChevronLeft,
  Delete,
  Ellipsis,
  Heart,
  MessageSquareText,
  MoveUp,
  Share,
  Share2,
  Trash,
  X,
} from "lucide-react";
import { DeckPost, SubmitComment } from "../../../model/deckpost.model";
import styles from "../../../styles/DetailStackPage.module.css";
import { formatTimeAgo, formatTimestamp } from "../../../utils/FormatDate";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  userCommentPost,
  userDeleteComment,
  userDeletePost,
} from "../../../services/functions/gsUserPostService";
import { useUserStore } from "../../../services/store/user.store";
import { detailStackEvent } from "../../../services/eventBus/detailStackEvent";
import ShareContent from "./ShareContent";
import { useRouter } from "next/router";

interface DetailStackProps {
  onClose: () => void;
  isLiked: boolean;
  postDetails: DeckPost;
}

const DetailStackPage = ({
  postDetails,
  isLiked,
  onClose,
}: DetailStackProps) => {
  const router = useRouter();
  const { sqlUser } = useUserStore();
  const userId = sqlUser?.userId;
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(postDetails?.listofcomments);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = sqlUser?.userId === postDetails?.userId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isCommenting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommenting]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCommenting(false);
    }
  };

  const cardlist = postDetails?.listofcards;
  const posteePic = postDetails?.displaypic;
  const selectedCover = postDetails?.selectedCover;
  const posteeName = postDetails?.name || "No Name";
  const postUrl = `${router.basePath}/stacks/${postDetails.postId}`;
  const emojiList = ["😀", "😂", "😍", "🔥", "👍", "💯", "🥳", "🤔", "🎉"];

  const addEmoji = (emoji: string, event: React.MouseEvent) => {
    event.preventDefault();
    setCommentText((prev) => prev + emoji);
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

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setIsDeleting(true);
      userDeletePost(postId);
      toggleMenu();
      sessionStorage.removeItem("stacksScrollState");
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setTimeout(()=>onClose(),500);
    }
  };

  const commentPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const commentForSubmit: SubmitComment = {
        comment: commentText,
        postId: postDetails.postId || "NO_POST_ID",
        posterId: postDetails.userId,
      };

      const commentRes = await userCommentPost(commentForSubmit);
      commentRes.displaypic = sqlUser?.displaypic || "No Display Pic";
      commentRes.name = sqlUser?.name || "No Name";
      commentList?.push(commentRes);
      setCommentText("");
      setIsCommenting(false);
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleJumpToComment = () => {
    const commentSection = document.getElementById("commentJump");
    if (commentSection) {
      commentSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleHeartClick = () => {
    if (!userId || !postDetails.postId) return;
    if (isLiked) {
      detailStackEvent.emit("post:unliked", postDetails.postId, userId);
    } else {
      detailStackEvent.emit("post:liked", postDetails.postId, userId);
    }
  };

  const handleSharePost = (e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    setIsShareOpen(true);
    toggleMenu();
  };

  const handleDelete = (postId: string, commentId: string) => {
    if (postId === "NO_POST_ID" || commentId === "NO_COMMENT_ID") return;
    try {
      userDeleteComment(postId, commentId);
      setCommentList((prev) => prev?.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className={styles["detail-main"]}>
        <div className={styles["detail-top"]}>
          <ChevronLeft className={styles["top-btn"]} onClick={onClose} />
          <div className={styles["postee-info"]}>
            <img
              className={styles["display-pic"]}
              src={posteePic}
              alt={posteeName}
              loading="lazy"
            />{" "}
            {posteeName.length > 20
              ? posteeName.slice(0, 17) + "..."
              : posteeName}
          </div>
          <div>
            <Ellipsis className={styles["top-btn"]} onClick={toggleMenu} />
            {menuOpen && (
              <div className={styles["dropdown-menu"]}>
                {isOwner && (
                  <button
                    className={styles["dropdown-menu-item"]}
                    onClick={(e) => handleDeletingPost(e, postDetails.postId)}
                  >
                    <Trash size={16} /> Delete
                  </button>
                )}
                <button
                  className={styles["dropdown-menu-item"]}
                  onClick={handleSharePost}
                >
                  <Share size={16} /> Share
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles["scroll-cont"]}>
          {cardlist && cardlist?.length > 0 && (
            <div className={styles["listofcard"]}>
              {cardlist?.length > 0 &&
                cardlist.map((card) => (
                  <div key={card._id} className={styles["card-item-holder"]}>
                    <img
                      src={card.imageSrc}
                      alt=""
                      className={styles["card-item"]}
                      loading="lazy"
                    />
                    <span className={styles["card-count"]}>{card.count}</span>
                  </div>
                ))}
            </div>
          )}
          {selectedCover &&
          <img src={selectedCover} alt="Cover"/>
          }
          <div className={styles["detail-content"]}>
            <h3>{postDetails?.headline}</h3>
            <p>{postDetails?.content}</p>
            <div className={styles["date-format"]}>
              {formatTimestamp(postDetails?.timestamp)}
            </div>
            <div className={styles["comment-list"]}>
              <div id="commentJump">{commentList?.length} comment</div>
              {commentList &&
                commentList?.length > 0 &&
                commentList.map((comment) => (
                  <div
                    className={styles["comment-holder"]}
                    key={comment.commentId}
                  >
                    <img
                      className={styles["comment-dp"]}
                      src={comment.displaypic}
                      alt=""
                    />
                    <div className={styles["comment-holder-text"]}>
                      <div className={styles["comment-holder-name"]}>
                        {" "}
                        {comment.name}
                      </div>
                      <span className={styles["comment-holder-comment"]}>
                        {comment.comment}
                      </span>
                      <div className={styles["comment-holder-func"]}>
                        <code>{formatTimeAgo(comment.timestamp)}</code>
                        {comment.userId == userId && (
                          <code
                            className={styles["delete-comment"]}
                            onClick={() =>
                              handleDelete(
                                postDetails.postId || "NO_POST_ID",
                                comment.commentId || "NO_COMMENT_ID"
                              )
                            }
                          >
                            DELETE
                          </code>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={styles["comment-bar"]}>
          <div
            className={styles["comment-input"]}
            title="input for comments"
            onClick={() => setIsCommenting(true)}
          >
            What is on your mind?
          </div>
          <div className={styles["comment-func"]}>
            <Heart
              width={"30px"}
              height={"30px"}
              fill={isLiked ? "var(--gs-color-secondary)" : "none"}
              stroke={isLiked ? "var(--gs-color-secondary)" : "currentColor"}
              style={{ cursor: "pointer" }}
              onClick={handleHeartClick}
            />
            <MessageSquareText
              width={"30px"}
              height={"30px"}
              onClick={handleJumpToComment}
            />
            <Share2 width={"30px"} height={"30px"} onClick={handleSharePost} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isCommenting && (
          <>
            {/* Overlay */}
            <motion.div
              className={styles["comment-overlay"]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
            />

            {/* Comment Input */}
            <motion.div
              className={styles["posting-comment"]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles["emoji-picker"]}>
                {emojiList.map((emoji) => (
                  <span key={emoji} onClick={(e) => addEmoji(emoji, e)}>
                    {emoji}
                  </span>
                ))}
              </div>
              <form onSubmit={commentPost} className={styles["comment-form"]}>
                <textarea
                  ref={textareaRef}
                  className={styles["comment-textarea"]}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type your comment..."
                />
                <motion.button
                  type="submit"
                  className={styles["comment-submit"]}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: commentText ? 1 : 0,
                    width: commentText ? "40px" : "0px",
                    marginLeft: commentText ? "0.5rem" : "0rem",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <MoveUp />
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isShareOpen && (
          <>
            {/* Overlay */}
            <motion.div
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

export default DetailStackPage;
