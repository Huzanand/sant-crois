import styles from "./footer.module.css";
import { useRouter } from "next/navigation";
import Logo from "../logo/Logo";
import { useLanguageSync } from "@/utils/useLanguage";
import Link from "next/link";
import { useOwnStore } from "@/store/storeProvider";

const Footer = () => {
    const router = useRouter();
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
                            <Link href={"https://t.me/stest1331_bot"}>
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
                                href={`/${selectedInterfaceLanguage}/term-of-use`}
                            >
                                <button className={`buttons-l ${styles.btn}`}>
                                    {t("TermsOfUse")}
                                </button>
                            </Link>
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
