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
                <h1 className="headlines-l">{t("contacts")}</h1>
                <div className={styles.content}>
                    <p>
                        <span className="body-l">{t("contactsContent.1")}</span>
                        <a href="mailto:santcrois.suport@gmail.com.">
                            santcrois.suport@gmail.com.
                        </a>
                    </p>
                    <p className="body-l">{t("contactsContent.2")}</p>
                </div>
            </div>
        </div>
    );
}
