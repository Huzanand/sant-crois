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
                <h1 className="headlines-l">{t("CookiePolicy")}</h1>
                <div className={styles.content}>
                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.1")}</h2>
                        <p className="body-m">{t("cookie.1-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.2")}</h2>
                        <p className="body-m">{t("cookie.2-1")}</p>
                        <ul>
                            <li className="body-m">{t("cookie.2-2")}</li>
                            <li className="body-m">{t("cookie.2-3")}</li>
                            <li className="body-m">{t("cookie.2-4")}</li>
                            <li className="body-m">{t("cookie.2-5")}</li>
                        </ul>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.3")}</h2>
                        <ul>
                            <li className="body-m">{t("cookie.3-1")}</li>
                            <li className="body-m">{t("cookie.3-2")}</li>
                            <li className="body-m">{t("cookie.3-3")}</li>
                            <li className="body-m">{t("cookie.3-4")}</li>
                        </ul>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.4")}</h2>
                        <p className="body-m">{t("cookie.4-1")}</p>
                        <p className="body-m">{t("cookie.4-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.5")}</h2>
                        <p className="body-m">{t("cookie.5-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <h2 className="body-l">{t("cookie.6")}</h2>
                        <p className="body-m">
                            <span className="body-l">{t("cookie.6-1")}</span>
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
