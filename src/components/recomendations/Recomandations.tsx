import Link from "next/link";
import Card from "../card/Card";
import styles from "./recomendations.module.css";
import { CaruselArrowLeftIco, CaruselArrowRightIco } from "@/assets/svg/icons";
import { ICard } from "@/models";
import { useRef, useState } from "react";

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

        if (direction === "prev") {
            sliderRef.current.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: "smooth",
            });
        } else {
            sliderRef.current.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: "smooth",
            });
        }

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
                    {content.map((item: ICard) => (
                        <div key={"link" + item.id} style={{ width: "100%" }}>
                            <Link href={`/lesson/${item.id}`}>
                                <Card
                                    id={item.id}
                                    header={item.header}
                                    key={item.id}
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
                                        boxShadow:
                                            "0px 4px 6px 0px rgba(163, 148, 205, 0.45)",
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
