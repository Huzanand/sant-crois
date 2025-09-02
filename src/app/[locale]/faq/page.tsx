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
                </div>

                <div className={styles.content}>
                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q1")}</p>
                        <p className="body-l">{t("faq.a1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q2")}</p>
                        <p className="body-l">{t("faq.a2")}</p>
                        <p className="body-l">{t("faq.a2-1")}</p>
                        <p className="body-l">{t("faq.a2-2")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q3")}</p>
                        <p className="body-l">{t("faq.a3")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q4")}</p>
                        <p className="body-l">{t("faq.a4")}</p>
                        <p className="body-l">{t("faq.a4-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q5")}</p>
                        <p className="body-l">{t("faq.a5")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q6")}</p>
                        <p className="body-l">{t("faq.a6")}</p>
                        <p className="body-l">{t("faq.a6-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q7")}</p>
                        <p className="body-l">{t("faq.a7")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q8")}</p>
                        <p className="body-l">{t("faq.a8")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q9")}</p>
                        <p className="body-l">{t("faq.a9")}</p>
                        <p className="body-l">{t("faq.a9-1")}</p>
                        <p className="body-l">
                            <span className="body-l">{t("faq.a9-2")}</span>
                            <a href="mailto:santcrois.suport@gmail.com">
                                santcrois.suport@gmail.com
                            </a>
                        </p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q10")}</p>
                        <p className="body-l">{t("faq.a10")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q11")}</p>
                        <p className="body-l">{t("faq.a11")}</p>
                        <p className="body-l">{t("faq.a11-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q12")}</p>
                        <p className="body-l">{t("faq.a12")}</p>
                        <p className="body-l">{t("faq.a12-1")}</p>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q13")}</p>
                        <ul>
                            <li>
                                <p className="body-l">{t("faq.a13-1")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("faq.a13-2")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("faq.a13-3")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("faq.a13-4")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("faq.a13-5")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("faq.a13-6")}</p>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.content_item}>
                        <p className="buttons-l">{t("faq.q14")}</p>
                        <p>
                            <span className="body-l">{t("faq.a14")}</span>
                            <a href="mailto:santcrois.suport@gmail.com">
                                santcrois.suport@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
