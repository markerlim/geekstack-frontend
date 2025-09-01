import { useUserStore } from "../../../services/store/user.store";
import { useState, useRef, useEffect } from "react";
import { Edit, Camera, Check, X } from "lucide-react";
import styles from "../../../styles/AccountComponent.module.css";
import { initAllCardsIndexDB } from "../../../services/functions/gsBoosterService";
import { TCGTYPE } from "../../../utils/constants";
import { db } from "../../../services/indexdb/carddatabase";
import { Table } from "dexie";
import { updatePreference } from "../../../services/functions/gsUserDetailsService";

const TCG_TABLES: Record<string, keyof typeof db> = {
  [TCGTYPE.UNIONARENA]: "unionarena",
  [TCGTYPE.ONEPIECE]: "onepiece",
  [TCGTYPE.COOKIERUN]: "cookierunbraverse",
  [TCGTYPE.DUELMASTERS]: "duelmasters",
  [TCGTYPE.DRAGONBALLZFW]: "dragonballzfw",
  [TCGTYPE.GUNDAM]: "gundam",
  [TCGTYPE.HOLOLIVE]: "hololive",
};

const supportedGames = Object.keys(TCG_TABLES);

const getOfflineModeKey = (tcg: string) => `${tcg.toLowerCase()}Offline`;

const getDefaultPreferences = () => ({
  unionarenaOffline: false,
  onepieceOffline: false,
  cookierunbraverseOffline: false,
  duelmastersOffline: false,
  dragonballzfwOffline: false,
  gundamOffline: false,
  hololiveOffline: false,
});

const AccountComponent = () => {
  const { sqlUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(sqlUser?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(sqlUser?.displaypic || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSetOfflineMode: boolean = ["admin", "premium", "vip"].includes(
    sqlUser?.membershipType ?? ""
  );

  // Parse preferences from string to object
  const parsePreferences = () => {
    if (!sqlUser?.preferences) {
      return getDefaultPreferences();
    }

    try {
      // If preferences is already an object, return it
      if (
        typeof sqlUser.preferences === "object" &&
        sqlUser.preferences !== null
      ) {
        return {
          ...getDefaultPreferences(),
          ...sqlUser.preferences,
        };
      }

      // If preferences is a string, parse it
      if (typeof sqlUser.preferences === "string") {
        return {
          ...getDefaultPreferences(),
          ...JSON.parse(sqlUser.preferences),
        };
      }

      return getDefaultPreferences();
    } catch (error) {
      console.error("Error parsing preferences:", error);
      return getDefaultPreferences();
    }
  };

  const getInitialOfflineModes = () => {
    const preferences = parsePreferences();

    return Object.fromEntries(
      supportedGames.map((tcg) => {
        const preferenceKey = getOfflineModeKey(tcg);
        const isEnabled =
          preferences[preferenceKey as keyof typeof preferences] || false;
        return [tcg, isEnabled];
      })
    );
  };

  const [offlineModes, setOfflineModes] = useState<Record<string, boolean>>(
    getInitialOfflineModes
  );

  useEffect(() => {
    setOfflineModes(getInitialOfflineModes());
  }, [sqlUser]);

  // Toggle handler
  const handleToggle = async (tcg: string) => {
    const isEnabled = offlineModes[tcg];
    const tableName = TCG_TABLES[tcg];
    const preferenceKey = getOfflineModeKey(tcg);

    try {
      if (!isEnabled) {
        await initAllCardsIndexDB(tcg);
      } else {
        await (db[tableName] as Table).clear();
      }

      const newOfflineModes = {
        ...offlineModes,
        [tcg]: !isEnabled,
      };
      setOfflineModes(newOfflineModes);

      // Get current preferences as object
      const currentPreferences = parsePreferences();

      // Create updated preferences
      const updatedPreferences = {
        ...currentPreferences,
        [preferenceKey]: !isEnabled,
      };

      await updatePreference(updatedPreferences);
    } catch (error) {
      console.error(`Failed to toggle ${tcg} offline mode:`, error);
      setOfflineModes((prev) => ({ ...prev, [tcg]: isEnabled }));
    }
  };

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
        {canSetOfflineMode && (
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Offline Mode</label>
            {supportedGames.map((tcg) => (
              <div key={tcg} className={styles.toggleContainer}>
                <span>{tcg}</span>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={offlineModes[tcg]}
                    onChange={() => handleToggle(tcg)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountComponent;
