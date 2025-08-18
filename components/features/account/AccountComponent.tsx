import { useUserStore } from "../../../services/store/user.store";
import { useState, useRef, useEffect } from "react";
import { Edit, Camera, Check, X } from "lucide-react";
import styles from "../../../styles/AccountComponent.module.css";

const AccountComponent = () => {
  const { sqlUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(sqlUser?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(sqlUser?.displaypic || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(sqlUser?.name || "");
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // Upload logic would go here
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (sqlUser) {
      setName(sqlUser.name);
      setAvatarPreview(sqlUser.displaypic);
    }
  }, [sqlUser]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Account Settings</h1>

        {/* Avatar Section */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <img
              src={avatarPreview}
              alt="User Avatar"
              className={styles.avatar}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.avatarInput}
              onChange={handleImageChange}
            />
            <button
              className={styles.avatarEditButton}
              onClick={handleAvatarClick}
            >
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Name Section */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Name</label>
          <div className="flex items-center">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.nameHolder}>
                <div className={styles.readOnlyField}>{name}</div>
                <Edit size={20} onClick={() => setIsEditing(true)} />
              </div>
            )}
            {isEditing && (
              <div className={styles.editControls}>
                <button
                  onClick={handleSave}
                  className={`${styles.button} ${styles.saveButton}`}
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Additional Info Section */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email</label>
          <div className={styles.readOnlyField}>{"user@example.com"}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountComponent;
