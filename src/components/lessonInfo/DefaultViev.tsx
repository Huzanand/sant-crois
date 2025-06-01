import { useOwnStore } from "@/store/storeProvider";
import styles from "./lessonInfo.module.css";
import {
    ArrowDownIco,
    InterfaceLanguageIco,
    SendTaskIco,
    StarIco,
} from "@/assets/svg/icons";
import Logo from "../logo/Logo";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import Divider from "../divider/Divider";
import { useRouter } from "next/navigation";
import Rating from "../rating/Rating";
import useTranslatedOptions from "@/utils/useTranslatedOptions";
import { useLanguageSync } from "@/utils/useLanguage";

const DefaultViev = () => {
    const {
        lesson,
        onSelectChange,
        selectedInterfaceLanguage,
        interfaceLanguageOptions,
        clearRecomendations,
        clearUserAnswers,
    } = useOwnStore((state) => state);

    const router = useRouter();

    const { t } = useLanguageSync();

    const parseDate = (isoString: Date) => {
        if (isoString === undefined || isoString === null) return "----------";
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
            <div className={styles.container__inner}>
                <div className={styles.header}>
                    <div className={styles.header__item}>
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

                        <Logo />
                    </div>

                    <div className={styles.header__item}>
                        <SettingsSelect
                            mode="absolute"
                            selectedOption={selectedInterfaceLanguage}
                            selectedOptionLabel={t(
                                `selectedInterfaceLanguage.${selectedInterfaceLanguage}`
                            )}
                            options={useTranslatedOptions(
                                interfaceLanguageOptions,
                                "interfaceLanguageOptions"
                            )}
                            onChangeSelect={onSelectChange}
                            changeField="selectedInterfaceLanguage"
                            ico={<InterfaceLanguageIco />}
                            activeIcon={<InterfaceLanguageIco fill={"#fff"} />}
                            shadow
                            isLessonPage
                        />
                    </div>
                </div>

                <Divider margin="16px 4px" />

                <div className={`body-s ${styles.content__container}`}>
                    <div className={styles.column}>
                        <div className={styles.item}>
                            <span>{`${t("age group")}:`}</span>
                            <div className={styles.content}>
                                {t(lesson?.targetAgeGroup as string)}
                            </div>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("author")}:`}</span>
                            <div className={styles.content}>
                                {lesson?.author}
                            </div>
                        </div>

                        <div className={styles.item}>
                            <span>{`${t("level")}:`}</span>
                            <div className={styles.content}>
                                {t(
                                    `selectedLanguageLevel.${lesson?.languageLevel}`
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.column}>
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
                                <div className={styles.content}>
                                    {t(
                                        `parsedComplexity.${parseDifficulty(
                                            lesson?.acceptance
                                        )}`
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.item}>
                            <span>{`${t("created")}:`}</span>
                            {lesson?.creationDateTime && (
                                <div className={styles.content}>
                                    {parseDate(lesson?.creationDateTime)}
                                </div>
                            )}
                        </div>
                        <div className={styles.item}>
                            <span>{`${t("views")}:`}</span>
                            <div className={styles.content}>
                                {lesson?.views}
                            </div>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.item}>
                            <span>{`${t("SuccessfullyCompleted")}:`}</span>
                            {/* /////////////// */}
                            <div className={styles.content}>15</div>
                        </div>

                        <button className={`buttons-l ${styles.btn}`}>
                            <SendTaskIco />
                            {t("assignStudent")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultViev;
