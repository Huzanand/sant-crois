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
                <h1 className="headlines-l">{t("aboutUs")}</h1>
                <div className={styles.content}>
                    <p className="body-l">{t("aboutUsContent1")}</p>
                    <p className="body-l">{t("aboutUsContent2")}</p>
                    <p className="body-l">{t("aboutUsContent3")}</p>
                </div>
            </div>
        </div>
    );
}
