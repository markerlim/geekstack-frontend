import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import TcgImage from "../components/TcgImage";
import styles from "../styles/IndexPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { tcgList } from "../data/tcgList";
import { BaseGameCard } from "../model/card.model";

const IndexPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [exchangeRate] = useState(106.54);
  const [cardList] = useState<BaseGameCard[]>([]);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      typeof swiperRef.current.params.navigation !== "boolean"
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <Layout title="Home | GeekStack">
      <div className={styles.homepage}>
        <SearchBar onSearchValue={setSearchValue} />
        {!searchValue ? (
          <>
            <div className={styles.swiperWrapper}>
              <Swiper
                modules={[Navigation]}
                spaceBetween={15}
                slidesPerView={"auto"}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className={styles.swiperContainer}
              >
                {tcgList.map((tcg, index) => (
                  <SwiperSlide key={index} className={styles.SwiperSlide}>
                    <Link href={tcg.path} className={styles.tcgItem}>
                      <Image
                        src={tcg.img}
                        alt={tcg.alt}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                ref={prevRef}
                className={styles.customPrev}
                aria-label="Previous slide"
              >
                &#8592;
              </button>
              <button
                ref={nextRef}
                className={styles.customNext}
                aria-label="Next slide"
              >
                &#8594;
              </button>
            </div>
            <div className={styles["additional-content"]}>
              <div className={styles["additional-header"]}>
                Today's Exchange Rate
              </div>
              <div className={styles["exchange-rate-container"]}>
                <span className={styles.currency}>1 SGD</span>
                <span className={styles.equals}>=</span>
                <span className={styles.value}>{exchangeRate.toFixed(2)}</span>
                <span className={styles.currency}>JPY</span>
              </div>
              <div className={styles["additional-sub-header"]}>
                Exchange rate refreshes daily at around 00:00 UTC
              </div>
            </div>
          </>
        ) : (
          <div className="search-results">
            {cardList.map((item) => (
              <TcgImage card={item} key={item._id} tcgtype=""/>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
