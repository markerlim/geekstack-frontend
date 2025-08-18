import { X } from "lucide-react";
import styles from "../../../styles/StacksPage.module.css";
import { useState } from "react";

interface ShareContentProps {
  postUrl: string;
  onClose: () => void;
}

const ShareContent = ({ postUrl, onClose }: ShareContentProps) => {
  const [IsCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const shareOnX = () => {
    const text = "Check out this Stack!";
    window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = "Check out this Stack! " + postUrl;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnTelegram = () => {
    const text = "Check out this Stack!";
    window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={styles.shareModal}>
      <div className={styles.shareHeader}>
        <h3>Share this Stack</h3>
        <button onClick={onClose} className={styles.closeShareButton}>
          <X size={24} />
        </button>
      </div>
      
      <div className={styles.shareInputContainer}>
        <input
          type="text"
          value={postUrl}
          readOnly
          className={styles.shareInput}
        />
        <button onClick={handleCopyLink} className={`${styles.copyButton} ${IsCopied && styles.copied}`}>
          {IsCopied ? <>Copied</>: <>Copy</>}
        </button>
      </div>
      
      <div className={styles.socialShareButtons}>
        <button 
          onClick={shareOnX} 
          className={`${styles.socialButton} ${styles.x}`}
          aria-label="Share on X"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
        
        <button 
          onClick={shareOnWhatsApp} 
          className={`${styles.socialButton} ${styles.whatsapp}`}
          aria-label="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.74-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
        
        <button 
          onClick={shareOnTelegram} 
          className={`${styles.socialButton} ${styles.telegram}`}
          aria-label="Share on Telegram"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ShareContent;