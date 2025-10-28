import { useOwnStore } from "@/store/storeProvider";
import styles from "./roomInfo.module.css";
import { ArrowDownIco } from "@/assets/svg/icons";
import { useRouter } from "next/navigation";
import { useLanguageSync } from "@/utils/useLanguage";
import dynamic from "next/dynamic";
import { TransformeKeepAliveTime } from "./TransformKeepAliveTime";

const BurgerMenu = dynamic(() => import("../burgerMenu/BurgerMenu"), {
    ssr: false,
});

const MobileViev = () => {
    const { clearRecomendations, clearUserAnswers, virtualRoom } = useOwnStore(
        (state) => state
    );

    const router = useRouter();

    const { t } = useLanguageSync();

    function showTimer() {
        if (virtualRoom?.finished) {
            return (
                <span className="headlines-s fw500">
                    {t("timer.lessonCompleted")}
                </span>
            );
        } else if (virtualRoom?.expired) {
            return (
                <span className="headlines-s fw500">
                    {t("timer.lessonFailed")}
                </span>
            );
        } else {
            return (
                <TransformeKeepAliveTime time={virtualRoom!.keepAliveTime} />
            );
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.mburger}>
                <BurgerMenu mode={"lesson"} />
            </div>

            <div className={styles.mnavigation}>
                <div
                    onClick={() => {
                        router.replace("/");
                        clearRecomendations();
                        clearUserAnswers();
                    }}
                >
                    <button className={`buttons-l ${styles.btnBack}`}>
                        <ArrowDownIco />
                    </button>
                </div>

                <p className={`${styles.mgreetengs} headlines-l`}>
                    {`${t("vr.welcome")}, ${virtualRoom?.challengerName}!`}
                </p>
            </div>

            <div className={styles.container__inner}>
                <div
                    className={`${styles.remaining_time} ${styles.mremaining_time}`}
                >
                    <span className="body-m">
                        {virtualRoom?.expired
                            ? t("timer.status")
                            : t("timer.keepAliweTime")}
                    </span>

                    <div style={{ whiteSpace: "nowrap" }}>{showTimer()}</div>
                </div>
            </div>
        </div>
    );
};

export default MobileViev;
