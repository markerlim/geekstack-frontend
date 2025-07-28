import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "../styles/IndexPage.module.css";
import Link from "next/link";
import { tcgList } from "../data/tcgList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExchangeRate from "./features/ExchangeRateComponent";

const HomeContent = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  // Swiper initialization
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
                <img
                  src={tcg.img}
                  alt={tcg.alt}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={prevRef}
          title="Previous slide"
          className={styles.customPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          ref={nextRef}
          className={styles.customNext}
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight />
        </button>
      </div>

      <ExchangeRate />
    </>
  );
};

export default HomeContent;
