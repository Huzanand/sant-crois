import { useOwnStore } from "@/store/storeProvider";
import styles from "./roomInfo.module.css";
import { ArrowDownIco, InterfaceLanguageIco } from "@/assets/svg/icons";
import Logo from "../logo/Logo";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import Divider from "../divider/Divider";
import { useRouter } from "next/navigation";
import useTranslatedOptions from "@/utils/useTranslatedOptions";
import { useLanguageSync } from "@/utils/useLanguage";
import { TransformeKeepAliveTime } from "./TransformKeepAliveTime";

const DefaultViev = () => {
    const {
        onSelectChange,
        selectedInterfaceLanguage,
        interfaceLanguageOptions,
        clearRecomendations,
        clearUserAnswers,
        virtualRoom,
    } = useOwnStore((state) => state);

    const router = useRouter();

    const { t } = useLanguageSync();

    return (
        <div className={styles.container}>
            <div className={styles.container__inner}>
                <div className={styles.header}>
                    <div className={styles.header__item}>
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

                        <Logo />
                    </div>

                    <div className={styles.header__item}>
                        <SettingsSelect
                            mode="absolute"
                            selectedOption={selectedInterfaceLanguage}
                            selectedOptionLabel={t(
                                `selectedInterfaceLanguage.${selectedInterfaceLanguage}`
                            )}
                            options={useTranslatedOptions(
                                interfaceLanguageOptions,
                                "interfaceLanguageOptions"
                            )}
                            onChangeSelect={onSelectChange}
                            changeField="selectedInterfaceLanguage"
                            ico={<InterfaceLanguageIco />}
                            activeIcon={<InterfaceLanguageIco fill={"#fff"} />}
                            shadow
                            isLessonPage
                        />
                    </div>
                </div>

                <Divider margin="16px 4px" />

                <div className={styles.content}>
                    <div className={`${styles.greetengs} headlines-l`}>
                        {`${t("vr.welcome")}, ${virtualRoom?.challengerName}!`}
                    </div>

                    <div className={`${styles.remaining_time}`}>
                        <span className="body-m">{t("vr.keepAliweTime")}</span>

                        <span
                            style={{ whiteSpace: "nowrap" }}
                            className="headlines-s"
                        >
                            {virtualRoom?.keepAliveTime && (
                                <TransformeKeepAliveTime
                                    time={virtualRoom.keepAliveTime}
                                />
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultViev;
