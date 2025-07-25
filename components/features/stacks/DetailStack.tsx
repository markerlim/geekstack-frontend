import {
  ChevronLeft,
  Heart,
  MessageSquareText,
  MoveUp,
  Share2,
} from "lucide-react";
import {
  DeckPost,
  SubmitComment,
} from "../../../model/deckpost.model";
import styles from "../../../styles/DetailStack.module.css";
import { formatTimeAgo, formatTimestamp } from "../../../utils/FormatDate";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  userCommentPost,
  userDeleteComment,
} from "../../../services/functions/gsUserPostService";
import { useUserStore } from "../../../services/store/user.store";

interface DetailStackProps {
  onClose: () => void;
  postDetails: DeckPost;
}

const DetailStack = ({ postDetails, onClose }: DetailStackProps) => {
  const { sqlUser } = useUserStore();
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(postDetails.listofcomments);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when isCommenting becomes true
  useEffect(() => {
    if (isCommenting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommenting]);

  // Close comment input when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCommenting(false);
    }
  };

  const cardlist = postDetails.listofcards;
  const userId = sqlUser.userId;
  const posteePic = postDetails.displaypic;
  const posteeName = postDetails.name;

  const emojiList = ["😀", "😂", "😍", "🔥", "👍", "💯", "🥳", "🤔", "🎉"];

  const addEmoji = (emoji: string, event: React.MouseEvent) => {
    event.preventDefault();
    setCommentText((prev) => prev + emoji);
  };

  const commentPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const commentForSubmit: SubmitComment = {
        comment: commentText,
        postId: postDetails.postId,
        posterId: postDetails.userId,
      };

      const commentRes = await userCommentPost(commentForSubmit);
      commentRes.displaypic = sqlUser.displaypic;
      commentRes.name = sqlUser.name;
      commentList.push(commentRes);
      setCommentText("");
      setIsCommenting(false);

      //fetchComments();
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Handle error (show toast/message)
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      await userDeleteComment(postId, commentId);
      setCommentList((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error("Delete failed:", error);
      // Optionally show error to user
    }
  };

  return (
    <>
      <div className={styles["detail-main"]}>
        <ChevronLeft className={styles["back-btn"]} onClick={onClose} />
        <div className={styles["postee-info"]}>
          <img
            className={styles["display-pic"]}
            src={posteePic}
            alt={posteeName}
          />{" "}
          {posteeName.length > 20
            ? posteeName.slice(0, 17) + "..."
            : posteeName}
        </div>
        <div className={styles["scroll-cont"]}>
          <div className={styles["listofcard"]}>
            {cardlist.map((card) => (
              <div key={card._id} className={styles["card-item-holder"]}>
                <img
                  src={card.imageSrc}
                  alt=""
                  className={styles["card-item"]}
                />
                <span className={styles["card-count"]}>{card.count}</span>
              </div>
            ))}
          </div>
          <div className={styles["detail-content"]}>
            <h3>{postDetails.headline}</h3>
            <p>{postDetails.content}</p>
            <div className={styles["date-format"]}>
              {formatTimestamp(postDetails.timestamp)}
            </div>
            <div className={styles["comment-list"]}>
              <div>{commentList.length} comment</div>
              {commentList.map((comment) => (
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
                            deleteComment(postDetails.postId, comment.commentId)
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
            <Heart width={"30px"} height={"30px"} />
            <MessageSquareText width={"30px"} height={"30px"} />
            <Share2 width={"30px"} height={"30px"} />
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
    </>
  );
};

export default DetailStack;
