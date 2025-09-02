import "/node_modules/flag-icons/css/flag-icons.min.css";
import styles from "./footer.module.css";
import Logo from "../logo/Logo";
import { useLanguageSync } from "@/utils/useLanguage";
import Link from "next/link";
import { useOwnStore } from "@/store/storeProvider";

const Footer = () => {
    const { t } = useLanguageSync();
    const { selectedInterfaceLanguage } = useOwnStore((state) => state);
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.content__logo}>
                        <Logo footer />
                    </div>

                    <div className={styles.leftLinks}>
                        <div className={styles.leftLinks__item}>
                            <Link href={"https://t.me/sant_crois_library_bot"}>
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("tgbot")}
                                </button>
                            </Link>
                        </div>
                        <div className={styles.leftLinks__item}>
                            <Link href={`/${selectedInterfaceLanguage}/about`}>
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("aboutUs")}
                                </button>
                            </Link>
                        </div>
                        <div className={styles.leftLinks__item}>
                            <Link href={`/${selectedInterfaceLanguage}/team`}>
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("team")}
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.rightLinks}>
                        <div className={styles.rightLinks__item}>
                            <Link href={`/${selectedInterfaceLanguage}/faq`}>
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("FAQ")}
                                </button>
                            </Link>
                        </div>
                        <div className={styles.rightLinks__item}>
                            <Link
                                href={`/${selectedInterfaceLanguage}/contacts`}
                            >
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("contacts")}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.policy}>
                    <div className={styles.policyLinks}>
                        <div className={styles.policyLinks__item}>
                            <Link
                                href={`/${selectedInterfaceLanguage}/terms-of-use`}
                            >
                                <button className={`buttons-m ${styles.btn}`}>
                                    {t("TermsOfUse")}
                                </button>
                            </Link>
                        </div>
                        <div className={styles.policyLinks__item}>
                            <Link
                                href={`/${selectedInterfaceLanguage}/privacy`}
                            >
                                <button className={`buttons-m ${styles.btn}`}>
                                    {t("PrivacyPolicy")}
                                </button>
                            </Link>
                        </div>
                        <div className={styles.policyLinks__item}>
                            <Link href={`/${selectedInterfaceLanguage}/cookie`}>
                                <button className={`buttons-m ${styles.btn}`}>
                                    {t("CookiePolicy")}
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.designedBy}>
                        <p style={{ marginBottom: "0.5rem" }}>
                            <span className="body-s" style={{ color: "#fff" }}>
                                {t("designedBy")}
                            </span>
                            <span className="fi fi-ua"></span>{" "}
                            <span className="fi fi-ch"></span>{" "}
                            <span className="fi fi-de"></span>{" "}
                            <span className="fi fi-pl"></span>{" "}
                        </p>
                        <p className="body-s">© Sant Crois 2024-2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
