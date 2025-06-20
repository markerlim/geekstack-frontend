import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBoosters } from "../../services/gsBoosterService";
import { Booster } from "../../interfaces/booster.model";
import styles from "../../styles/BoosterList.module.css";
import Link from "next/link";
import { TCGTYPE } from "../../utils/constants";
import { useDevice } from "../../contexts/DeviceContext";

const BoosterList = () => {
  const deviceType = useDevice();

  const { tcg } = useRouter().query;
  const getCleanBasePath = () => {
    const router = useRouter();
    let path = router.pathname
      .replace(/\[\[\.\.\..+?\]\]/g, "")
      .replace(/\[.+?\]/g, "")
      .replace(/\/+/g, "/") // Replace multiple slashes with single
      .replace(/\/$/, ""); // Remove trailing slash

    return path;
  };

  const basePath = getCleanBasePath();

  const imageClass =
    deviceType === "mobile"
      ? styles.imageMobile
      : styles.imageDesktop;

  const [showCategoryBtn, setShowCategoryBtn] = useState(false);
  const [category, setCategory] = useState("expansion");
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [error, setError] = useState<string | null>(null);

  const TCGS_WITH_CATEGORY = [
    TCGTYPE.ONEPIECE,
    TCGTYPE.COOKIERUN,
    TCGTYPE.DUELMASTERS,
  ];

  const selectCategory = (value: string) => {
    setCategory(value);
    console.log(value);
  };

  const hasExtraCategory =
    tcg === TCGTYPE.ONEPIECE || tcg === TCGTYPE.DUELMASTERS;

  const filteredBoosters = boosters.filter((booster) => {
    if (!category) return true;
    if (category === "expansion") {
      return booster?.category === "expansion" || booster?.category === null;
    }
    return booster?.category === category;
  });

  useEffect(() => {
    if (typeof tcg === "string") {
      setShowCategoryBtn(TCGS_WITH_CATEGORY.includes(tcg.toLowerCase()));

      fetchBoosters(tcg)
        .then((data) => {
          setBoosters(data); // set full data first
          setError(null);
        })
        .catch(() => setError("Failed to load boosters"));
    }
  }, [tcg]);

  return (
    <>
      {showCategoryBtn ? (
        <div className={styles.categoryHolder}>
          <div
            onClick={() => selectCategory("expansion")}
            className={`${styles["category-item"]} ${
              category === "expansion" ? styles["selected-category-item"] : ""
            }`}
          >
            Expansion
          </div>
          {hasExtraCategory && (
            <div
              onClick={() => selectCategory("extra")}
              className={`${styles["category-item"]} ${
                category === "extra" ? styles["selected-category-item"] : ""
              }`}
            >
              Extra
            </div>
          )}
          <div
            onClick={() => selectCategory("deck")}
            className={`${styles["category-item"]} ${
              category === "deck" ? styles["selected-category-item"] : ""
            }`}
          >
            Starter
          </div>
        </div>
      ) : (
        <div className={styles.buffer}> </div>
      )}
      <div className={styles["booster-list"]}>
        {filteredBoosters.map((booster) => (
          <Link
            href={`${basePath}/${tcg}/${booster.pathname}`.replace(/\/+/g, "/")}
            key={booster.pathname}
            className={styles["booster-item"]}
          >
            <img
              className={imageClass}
              src={booster.imageSrc}
              alt={booster.alt}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default BoosterList;
