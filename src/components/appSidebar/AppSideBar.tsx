import { useOwnStore } from "@/store/storeProvider";
import styles from "./appSideBar.module.css";
import { useState } from "react";

import Divider from "@/components/divider/Divider";
import { ArrowDownIco, SettingsIco, SortingIco } from "@/assets/svg/icons";
import TypeOfLesson from "../typeOfLesson/TypeOfLesson";
import Settings from "../settings/Settings";
import Logo from "../logo/Logo";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import Filters from "../filters/Filters";
import BurgerMenu from "../burgerMenu/BurgerMenu";
import { useMobile } from "@/utils/useMobile";
import { useLanguageSync } from "@/utils/useLanguage";
import useTranslatedOptions from "@/utils/useTranslatedOptions";
import TruncateText from "@/utils/TrankateText";

const AppSideBar = () => {
    const {
        activeTypeOfLesson,
        sortingOptions,
        selectedSorting,
        onSelectChange,
    } = useOwnStore((state) => state);

    const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false);
    const isMobile = useMobile(965);
    const is425px = useMobile(425);

    const { t } = useLanguageSync();

    return (
        <div className={styles.sideBar}>
            {!isMobile && (
                <div className={styles.sideBar_main}>
                    <div className={styles.content__container}>
                        <div className={styles.logo}>
                            <Logo />
                        </div>

                        {!settingsIsOpen && (
                            <div className={styles.content}>
                                <TypeOfLesson />

                                <Divider />

                                <div
                                    className={styles.typeItem}
                                    onClick={() => setSettingsIsOpen(true)}
                                >
                                    <SettingsIco />
                                    <span className="buttons-l ln24">
                                        {t("settings")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {settingsIsOpen && (
                            <div style={{ alignSelf: "stretch" }}>
                                <div
                                    className={styles.typeItem}
                                    onClick={() => setSettingsIsOpen(false)}
                                >
                                    <div style={{ transform: "rotate(90deg)" }}>
                                        <ArrowDownIco />
                                    </div>
                                    <span className="buttons-l ln24">
                                        {t(activeTypeOfLesson)}
                                    </span>
                                </div>

                                <Divider />

                                <Settings />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isMobile && <BurgerMenu mode={"home"} />}

            <div className={styles.filters}>
                <div className={styles.filters__item}>
                    <SettingsSelect
                        mode={isMobile ? "modal" : "default"}
                        options={useTranslatedOptions(
                            sortingOptions,
                            "sortingOptions"
                        )}
                        selectedOption={selectedSorting}
                        selectedOptionLabel={
                            is425px
                                ? TruncateText(
                                      t(`selectedSorting.${selectedSorting}`),
                                      15
                                  )
                                : t(`selectedSorting.${selectedSorting}`)
                        }
                        onChangeSelect={onSelectChange}
                        changeField={"selectedSorting"}
                        ico={<SortingIco />}
                        activeIcon={<SortingIco fill={"#fff"} />}
                        shadow={isMobile ? false : true}
                        border={isMobile ? true : false}
                        isSorting
                    />
                </div>

                <div className={styles.filters__item}>
                    <Filters />
                </div>
            </div>
        </div>
    );
};

export default AppSideBar;
