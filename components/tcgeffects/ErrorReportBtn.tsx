import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import styles from "../../styles/EffectTable.module.css";
import { userReportError } from "../../services/functions/gsUserPostService";
import { useUserStore } from "../../services/store/user.store";

interface ErrorReportProps {
    id: string
}

const ErrorReportBtn = ({id}:ErrorReportProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {mongoUser} = useUserStore();
  const [formData, setFormData] = useState({
    cardUid: id,
    userId: mongoUser?.userId,
    errorMsg: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.errorMsg.trim()) {
        alert("Please enter an error description");
        return;
      }

      console.log("Submitting:", formData);
      // Uncomment when ready to submit
      await userReportError(formData.cardUid, formData.userId as string, formData.errorMsg);

      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          cardUid: "",
          userId: "",
          errorMsg: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to submit error report:", error);
      alert("Failed to submit error report. Please try again.");
    }
  };

  return (
    <>
      <div
        className={styles["error-container"]}
        onClick={handleOpenModal}
        style={{ cursor: "pointer" }}
      >
        <TriangleAlert className={styles["error-icon"]} size={20} />
        <span className={styles["error-label"]}>Report Error</span>
      </div>

      {isModalOpen && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            {!isSubmitted ? (
              <>
                <h3>Report an Error</h3>
                <p>Please describe the issue you encountered:</p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="cardUid"
                    value={formData.cardUid}
                  />
                  <input type="hidden" name="userId" value={formData.userId} />
                  <label
                    htmlFor="errorMsg"
                    className={styles["textarea-label"]}
                  >
                    Error Description
                  </label>
                  <textarea
                    id="errorMsg"
                    name="errorMsg"
                    value={formData.errorMsg}
                    onChange={handleChange}
                    placeholder="Describe the error..."
                    required
                    rows={5}
                    className={styles["error-textarea"]}
                  />

                  <div className={styles["modal-actions"]}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className={styles["cancel-report"]}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles["submit-report"]}
                      disabled={!formData.errorMsg.trim()}
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles["success-message"]}>
                <p>Thank you for your report!</p>
                <button
                  onClick={handleCloseModal}
                  className={styles["close-btn"]}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorReportBtn;
