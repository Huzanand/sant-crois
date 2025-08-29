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
                    <span className="body-l">{t("contactsContent")}</span>
                    <a href="mailto:sant-crois@gmail.com">
                        sant-crois@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
