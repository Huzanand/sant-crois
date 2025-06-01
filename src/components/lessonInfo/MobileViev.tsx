import { useOwnStore } from "@/store/storeProvider";
import styles from "./lessonInfo.module.css";
import { ArrowDownIco, SendTaskIco, StarIco } from "@/assets/svg/icons";
import { useRouter } from "next/navigation";
import Rating from "../rating/Rating";
import BurgerMenu from "../burgerMenu/BurgerMenu";
import { useLanguageSync } from "@/utils/useLanguage";

const MobileViev = () => {
    const { lesson, clearRecomendations, clearUserAnswers } = useOwnStore(
        (state) => state
    );

    const router = useRouter();

    const { t } = useLanguageSync();

    const parseDate = (isoString: Date) => {
        const date = new Date(isoString);
        return [
            String(date.getDate()).padStart(2, "0"),
            String(date.getMonth() + 1).padStart(2, "0"),
            date.getFullYear(),
        ].join("-");
    };

    const parseDifficulty = (acceptance: number) => {
        if (acceptance > 0.8) return "light";
        else if (acceptance > 0.3) return "medium";
        else return "hard";
    };

    return (
        <div className={styles.container}>
            <div className={styles.mburger}>
                <BurgerMenu mode={"lesson"} />
            </div>

            <div className={styles.mnavigation}>
                <div
                    onClick={() => {
                        router.replace("/");
                        clearRecomendations();
                        clearUserAnswers();
                    }}
                >
                    <button className={`buttons-l ${styles.btnBack}`}>
                        <ArrowDownIco />
                    </button>
                </div>

                <button className={`buttons-l ${styles.btn}`}>
                    <SendTaskIco />
                    {t("assignStudent")}
                </button>
            </div>

            <div className={styles.container__inner}>
                <h1
                    className="headlines-l"
                    style={{ textAlign: "center", paddingBottom: "24px" }}
                >
                    {lesson?.header}
                </h1>
                <div className={`body-s ${styles.content__container}`}>
                    <div className={styles.column}>
                        <div className={styles.item}>
                            <span>{`${t("age group")}:`}</span>
                            <span className={styles.content}>
                                {t(lesson?.targetAgeGroup as string)}
                            </span>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("author")}:`}</span>
                            <span className={styles.content}>
                                {lesson?.author}
                            </span>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("level")}:`}</span>
                            <span className={styles.content}>
                                {t(
                                    `selectedLanguageLevel.${lesson?.languageLevel}`
                                )}
                            </span>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("rating")}:`}</span>
                            {lesson?.acceptance && (
                                <Rating
                                    rating={lesson.acceptance}
                                    ICon={StarIco}
                                />
                            )}
                        </div>
                        <div className={styles.item}>
                            <span>{`${t("complexity")}`}</span>
                            {lesson?.acceptance && (
                                <span className={styles.content}>
                                    {t(
                                        `parsedComplexity.${parseDifficulty(
                                            lesson?.acceptance
                                        )}`
                                    )}
                                </span>
                            )}
                        </div>
                        <div className={styles.item}>
                            <span>{`${t("created")}:`}</span>
                            {lesson?.creationDateTime ? (
                                <span className={styles.content}>
                                    {parseDate(lesson.creationDateTime)}
                                </span>
                            ) : (
                                <span className={styles.content}>
                                    ----------
                                </span>
                            )}
                        </div>
                        <div className={styles.item}>
                            <span>{`${t("views")}:`}</span>
                            <span className={styles.content}>
                                {lesson?.views}
                            </span>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("SuccessfullyCompleted")}:`}</span>
                            <span className={styles.content}>15</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileViev;
