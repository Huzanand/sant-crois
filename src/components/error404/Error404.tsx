import styles from "./error404.module.css";
import Image from "next/image";
import maskot from "../../assets/maskot_not_found.png";
import { useOwnStore } from "@/store/storeProvider";

const Error404 = () => {
    const {
        fetchLessons,
        selectedLearningLanguage,
        setOffset,
        onSelectChange,
        setActiveTypeOfLesson,
        clearFilters,
        resetSize,
    } = useOwnStore((state) => state);

    return (
        <div className={styles.container}>
            <div className={styles.text_content}>
                <h2 className="headlines-l">Я ничего не смог найти...</h2>
                <p className="body-l">
                    Вы можете попробовать другие фильтры. Или вернуться на
                    главную и выбрать из списка
                </p>

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
                    <span className="buttons-l">To Home Page</span>
                </button>
            </div>

            <Image src={maskot.src} width={272} height={282} alt="maskot" />
        </div>
    );
};

export default Error404;
