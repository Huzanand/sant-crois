import Image from "next/image";
import styles from "./page.module.css";
import { getServerTranslation } from "@/utils/getServerTranslations";
import Latyshev from "../../../assets/developers/LatyshevA.png";
import Latysheva from "../../../assets/developers/LatyshevaK.png";
import Ihnatova from "../../../assets/developers/IhnatovaK.png";
import Domkin from "../../../assets/developers/DomkinO.png";
import Didenko from "../../../assets/developers/DidenkoO.png";
import Zlobin from "../../../assets/developers/ZlobinE.png";
import Ivan from "../../../assets/developers/Ivan.png";

Ihnatova;
type Locale = "English" | "Ukrainian" | "French" | "German";

interface TeamPageProps {
    params: {
        locale: Locale;
    };
}

export default async function TeamPage({ params: { locale } }: TeamPageProps) {
    const t = await getServerTranslation(locale);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className="headlines-l">{t("team")}</h1>

                    <div className={styles.header_content}>
                        <p className="body-l">{t("teamContent.1")}</p>
                        <p className="body-l">{t("teamContent.2")}</p>
                        <p className="body-l">{t("teamContent.3")}</p>
                        <ul>
                            <li>
                                <p className="body-l">{t("teamContent.4")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("teamContent.5")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("teamContent.6")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("teamContent.7")}</p>
                            </li>
                            <li>
                                <p className="body-l">{t("teamContent.8")}</p>
                            </li>
                        </ul>
                        <p className="body-l">{t("teamContent.9")}</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.card}>
                        <Image
                            src={Latyshev.src}
                            alt="Andrii Latyshev"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Andrii Latyshev</h2>
                        <h3 className="body-s">
                            {t("Founder & Product owner")}
                        </h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Ihnatova.src}
                            alt="Kateryna Ihnatova"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Kateryna Ihnatova</h2>
                        <h3 className="body-s">{t("UX/UI designer")}</h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Domkin.src}
                            alt="Oleksii Domkin"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Oleksii Domkin</h2>
                        <h3 className="body-s">{t("Front-end developer")}</h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Didenko.src}
                            alt="Olena Didenko"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Olena Didenko</h2>
                        <h3 className="body-s">{t("Back-end developer")}</h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Zlobin.src}
                            alt="Yevhen Zlobin"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Yevhen Zlobin</h2>
                        <h3 className="body-s">{t("Back-end developer")}</h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Ivan.src}
                            alt="Ivan"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Ivan</h2>
                        <h3 className="body-s">{t("Back-end developer")}</h3>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src={Latysheva.src}
                            alt="Karyna Latysheva"
                            width={267}
                            height={251}
                        />
                        <h2 className="body-l">Karyna Latysheva</h2>
                        <h3 className="body-s">{t("Content manager")}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
