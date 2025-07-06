import { useLanguageSync } from "@/utils/useLanguage";
import Logo from "../../logo/Logo";
import styles from "./resultsHeader.module.css";

const ResultsHeader = () => {
    const { t } = useLanguageSync();
    return (
        <div className={styles.container}>
            <Logo />

            <div className={styles.content}>
                <h2>{t("checkUnswersGreetings")} </h2>
            </div>
        </div>
    );
};

export default ResultsHeader;
