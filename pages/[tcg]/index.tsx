import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { fetchBoosters } from "../../services/gsBoosterService";
import { Booster } from "../../interfaces/booster.model";
import styles from "../../styles/BoosterList.module.css";
import Image from "next/image";
import Link from "next/link";
import { TCGTYPE } from "../../utils/constants";

const BoosterListPage = () => {
  const { tcg } = useRouter().query;
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

  if (error) return <Layout title="Error">{error}</Layout>;

  return (
    <Layout title={`${tcg?.toString().toUpperCase()} Boosters`}>
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
            href={`/${tcg}/${booster.pathname}`}
            key={booster._id.$oid}
            className={styles["booster-item"]}
          >
            <Image
              src={booster.imageSrc}
              alt={booster.alt}
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default BoosterListPage;
