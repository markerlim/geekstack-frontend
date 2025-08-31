import { useState, useEffect } from "react";
import { getNotifications } from "../../../services/functions/gsUserDetailsService";
import { Notification } from "../../../model/user.model";
import styles from "../../../styles/Notifications.module.css";
import { formatTimestamp } from "../../../utils/FormatDate";
import { useRouter } from "next/router";

interface ListOfNotificationsProps {
    isComponent: boolean
}

const ListOfNotifications = ({isComponent}:ListOfNotificationsProps) => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigateToPost = (postId: string) => {
        router.push(`/stack/${postId}`);
    }
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                setNotifications(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch notifications");
                setLoading(false);
                console.error(err);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className={styles.notificationsContainer}>
            <div className={styles.notificationsHeader}>
                <h2>Notifications</h2>
            </div>
            
            {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                    No notifications found
                </div>
            ) : (
                <ul className={`${styles.notificationsList} ${isComponent ? styles.component : styles.nonComponent}`}>
                    {loading && <div className={styles.loading}>Loading notifications...</div>}
                    {error && <div className={styles.error}>{error}</div>}
                    {notifications.map((notification) => (
                        <li 
                            key={notification.notificationId} 
                            className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                            onClick={() => navigateToPost(notification.postId)}
                        >
                            <div className={styles.notificationContent}>
                                <img 
                                    src={notification.senderDp || '/default-avatar.png'} 
                                    alt={notification.senderName}
                                    className={styles.avatar}
                                />
                                <div className={styles.notificationDetails}>
                                    <div className={styles.notificationMeta}>
                                        <p className={styles.senderName}>
                                            {notification.senderName}
                                        </p>
                                        <span className={styles.timestamp}>
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>
                                    <p className={styles.message}>
                                        {notification.message}
                                    </p>
                                    {notification.postId && (
                                        <div className={styles.postReference}>
                                            Related to post #{notification.postId}
                                        </div>
                                    )}
                                </div>
                                {!notification.isRead && (
                                    <span className={styles.unreadIndicator}></span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListOfNotifications;