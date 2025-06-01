import styles from "./footer.module.css";
import { useRouter } from "next/navigation";
import Logo from "../logo/Logo";
import { useLanguageSync } from "@/utils/useLanguage";

const Footer = () => {
    const router = useRouter();
    const { t } = useLanguageSync();
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.content__logo}>
                        <Logo footer />
                    </div>

                    <div className={styles.leftLinks}>
                        <div
                            className={styles.leftLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("tgbot")}
                            </button>
                        </div>
                        <div
                            className={styles.leftLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("aboutUs")}
                            </button>
                        </div>
                        <div
                            className={styles.leftLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("team")}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rightLinks}>
                        <div
                            className={styles.rightLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("FAQ")}
                            </button>
                        </div>
                        <div
                            className={styles.rightLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("contacts")}
                            </button>
                        </div>
                        <div
                            className={styles.rightLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-l ${styles.btn}`}>
                                {t("help")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.policy}>
                    <div className={styles.policyLinks}>
                        <div
                            className={styles.policyLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-m ${styles.btn}`}>
                                {t("TermsOfUse")}
                            </button>
                        </div>
                        <div
                            className={styles.policyLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-m ${styles.btn}`}>
                                {t("PrivacyPolicy")}
                            </button>
                        </div>
                        <div
                            className={styles.policyLinks__item}
                            onClick={() => router.replace("/")}
                        >
                            <button className={`buttons-m ${styles.btn}`}>
                                {t("CookiePolicy")}
                            </button>
                        </div>
                    </div>

                    <div className={styles.designedBy}>
                        <p className="body-s">{t("designedBy")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
