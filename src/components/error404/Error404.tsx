import styles from "./error404.module.css";
import Image from "next/image";
import maskot from "../../assets/maskot_not_found.png";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";
import Link from "next/link";

interface errorProps {
    page: "home" | "lesson" | "check";
}

const Error404: React.FC<errorProps> = ({ page }) => {
    const {
        fetchLessons,
        selectedLearningLanguage,
        setOffset,
        onSelectChange,
        setActiveTypeOfLesson,
        clearFilters,
        resetSize,
    } = useOwnStore((state) => state);

    const { t } = useLanguageSync();

    return (
        <div className={styles.container}>
            <div className={styles.text_content}>
                <h2 className="headlines-l">{t("maskot404.header")}</h2>
                {page === "home" ? (
                    <p className="body-l">{t("maskot404.text")}</p>
                ) : undefined}

                {page === "home" ? (
                    <button
                        className={styles.btn}
                        onClick={() => {
                            fetchLessons(
                                12,
                                "all",
                                "All",
                                selectedLearningLanguage,
                                [],
                                [],
                                [],
                                [],
                                0,
                                "rating"
                            );
                            setOffset(0);
                            onSelectChange("selectedLanguageLevel", "All");
                            setActiveTypeOfLesson("all");
                            clearFilters();
                            resetSize();
                        }}
                    >
                        <span className="buttons-l">
                            {t("maskot404.resetFilters")}
                        </span>
                    </button>
                ) : (
                    <Link href={"/"}>
                        <button className={styles.btn}>
                            <span className="buttons-l">
                                {t("maskot404.homeButton")}
                            </span>
                        </button>
                    </Link>
                )}
            </div>

            <Image src={maskot.src} width={272} height={282} alt="maskot" />
        </div>
    );
};

export default Error404;
