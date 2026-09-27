import Link from "next/link";
import { useRef, useState } from "react";

import Card from "../card/Card";
import styles from "./recomendations.module.css";
import { CaruselArrowLeftIco, CaruselArrowRightIco } from "@/assets/svg/icons";
import { ICard } from "@/models";

type RecomendationsProps = {
  content: ICard[];
};

const Recomendations: React.FC<RecomendationsProps> = ({ content }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const moveSlider = (direction: "prev" | "next") => {
    if (!sliderRef.current || isAnimating) return;

    setIsAnimating(true);

    const scrollAmount = 280;
    const currentScroll = sliderRef.current.scrollLeft;
    const scrollDirection = direction === "prev" ? -1 : 1;

    sliderRef.current.scrollTo({
      left: currentScroll + scrollAmount * scrollDirection,
      behavior: "smooth",
    });

    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider__container}>
        <div
          className={`${styles.slider__arrow} ${styles.arrow__prev}`}
          onClick={() => moveSlider("prev")}
        >
          <CaruselArrowLeftIco />
        </div>

        <div className={styles.slider} ref={sliderRef}>
          {content.map((item) => (
            <div key={item.id} style={{ width: "100%" }}>
              <Link href={`/lesson/${item.id}`}>
                <Card
                  id={item.id}
                  header={item.header}
                  cover={item.cover as string}
                  primaryTopics={item.primaryTopics}
                  secondaryTopics={item.secondaryTopics}
                  learningLanguage={item.learningLanguage}
                  languageLevel={item.languageLevel}
                  acceptance={item.acceptance}
                  rating={item.rating}
                  views={item.views}
                  customStyles={{
                    width: "268px",
                    height: "300px",
                    margin: "6px",
                    boxShadow: "0px 4px 6px 0px rgba(163, 148, 205, 0.45)",
                  }}
                  recomendation
                />
              </Link>
            </div>
          ))}
        </div>

        <div
          className={`${styles.slider__arrow} ${styles.arrow__next}`}
          onClick={() => moveSlider("next")}
        >
          <CaruselArrowRightIco />
        </div>
      </div>
    </div>
  );
};

export default Recomendations;
