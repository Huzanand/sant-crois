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
                        <h2 className="body-l">{t("privacy.1")}</h2>
                        <p className="body-m">{t("privacy.1-1")}</p>
                        <p className="body-m">{t("privacy.1-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.2")}</h2>
                        <p className="body-m">{t("privacy.2-1")}</p>
                        <ul>
                            <li className="body-m">{t("privacy.2-2")}</li>
                            <li className="body-m">{t("privacy.2-3")}</li>
                            <li className="body-m">{t("privacy.2-4")}</li>
                            <li className="body-m">{t("privacy.2-5")}</li>
                        </ul>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.3")}</h2>
                        <p className="body-m">{t("privacy.3-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.4")}</h2>
                        <p className="body-m">{t("privacy.4-1")}</p>
                        <p className="body-m">{t("privacy.4-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.5")}</h2>
                        <p className="body-m">{t("privacy.5-1")}</p>
                        <ul>
                            <li className="body-m">{t("privacy.5-2")}</li>
                            <li className="body-m">{t("privacy.5-3")}</li>
                            <li className="body-m">{t("privacy.5-4")}</li>
                            <li className="body-m">{t("privacy.5-5")}</li>
                        </ul>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.6")}</h2>
                        <p className="body-m">{t("privacy.6-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("privacy.7")}</h2>
                        <p className="body-m">
                            <span className="body-l">{t("privacy.7-1")}</span>
                            <a href="mailto:sant-crois@gmail.com">
                                sant-crois@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
