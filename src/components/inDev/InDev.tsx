import { useOwnStore } from "@/store/storeProvider";
import styles from "./inDev.module.css";
import { useLanguageSync } from "@/utils/useLanguage";
import Image from "next/image";
import maskot from "../../assets/coming soon.png";

const InDev = () => {
    const { openInDev, setOpenInDev } = useOwnStore((state) => state);
    const { t } = useLanguageSync();
    return (
        <>
            {openInDev && (
                <div
                    className={styles.wrapper}
                    onClick={() => setOpenInDev(false)}
                >
                    <div className={styles.container}>
                        <Image
                            src={maskot}
                            height={300}
                            width={266}
                            alt="coming soon image"
                            style={{ margin: "0 auto", display: "block" }}
                        />
                        <p className={styles.content}>{t("inDev")}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default InDev;
