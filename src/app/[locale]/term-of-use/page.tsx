import styles from "./page.module.css";
import { getServerTranslation } from "@/utils/getServerTranslations";

type Locale = "English" | "Ukrainian" | "French" | "German";

interface AboutPageProps {
    params: {
        locale: Locale;
    };
}

export default async function AboutPage({
    params: { locale },
}: AboutPageProps) {
    const t = await getServerTranslation(locale);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className="headlines-l">{t("TermsOfUse")}</h1>
                <div className={styles.content}>
                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.1")}</h2>
                        <p className="body-m">{t("termsOfUseContent.1-1")}</p>
                        <p className="body-m">{t("termsOfUseContent.1-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.2")}</h2>
                        <p className="body-m">{t("termsOfUseContent.2-1")}</p>
                        <p className="body-m">{t("termsOfUseContent.2-2")}</p>
                        <p className="body-m">{t("termsOfUseContent.2-3")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.3")}</h2>
                        <p className="body-m">{t("termsOfUseContent.3-1")}</p>
                        <p className="body-m">{t("termsOfUseContent.3-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.4")}</h2>
                        <p className="body-m">{t("termsOfUseContent.4-1")}</p>
                        <p className="body-m">{t("termsOfUseContent.4-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.5")}</h2>
                        <p className="body-m">{t("termsOfUseContent.5-1")}</p>
                        <p className="body-m">{t("termsOfUseContent.5-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("termsOfUseContent.6")}</h2>
                        <p className="body-m">{t("termsOfUseContent.6-1")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
