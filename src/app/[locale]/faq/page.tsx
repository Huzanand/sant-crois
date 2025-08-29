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
                <div className={styles.header}>
                    <h1 className="headlines-l">{t("FAQ")}</h1>

                    <p className="body-l">{t("faq.subtitle")}</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q1")}</p>
                        <p className="body-l">{t("faq.a1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q2")}</p>
                        <p className="body-l">{t("faq.a2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q3")}</p>
                        <p className="body-l">{t("faq.a3")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q4")}</p>
                        <p className="body-l">{t("faq.a4")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q5")}</p>
                        <p className="body-l">{t("faq.a5")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
