import { useOwnStore } from "@/store/storeProvider";
import styles from "./appSideBar.module.css";
import { useEffect, useRef, useState } from "react";

import Divider from "@/components/divider/Divider";
import { ArrowDownIco, SettingsIco, SortingIco } from "@/assets/svg/icons";
import TypeOfLesson from "../typeOfLesson/TypeOfLesson";
import Settings from "../settings/Settings";
import Logo from "../logo/Logo";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import Filters from "../filters/Filters";
import { useMobile } from "@/utils/useMobile";
import { useLanguageSync } from "@/utils/useLanguage";
import useTranslatedOptions from "@/utils/useTranslatedOptions";
import TruncateText from "@/utils/TrankateText";
import dynamic from "next/dynamic";

const BurgerMenu = dynamic(() => import("../burgerMenu/BurgerMenu"), {
    ssr: false,
});

const AppSideBar = () => {
    const {
        activeTypeOfLesson,
        sortingOptions,
        selectedSorting,
        onSelectChange,
        homePageContentHeight,
    } = useOwnStore((state) => state);

    const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false);
    const isMobile = useMobile(1012);
    const is425px = useMobile(425);

    const { t } = useLanguageSync();

    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const settingsRef = useRef<HTMLDivElement | null>(null);
    const sortingRef = useRef<HTMLDivElement | null>(null);
    const filtersRef = useRef<HTMLDivElement | null>(null);

    const [filtersIsOpen, setFiltersIsOpen] = useState(false);
    const [filtersHeightCulced, setFiltersHeightCulced] = useState<number>(0);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (!sidebarRef.current || !filtersRef.current) return;

            const sidebarHeight = sidebarRef.current.offsetHeight;
            const contentHeight = homePageContentHeight;

            const spareHeight = Math.max(
                contentHeight -
                    sidebarHeight +
                    filtersRef.current?.offsetHeight -
                    119 || 0,
                280
            );

            setFiltersHeightCulced(spareHeight);
        });

        if (sidebarRef.current) observer.observe(sidebarRef.current);

        return () => observer.disconnect();
    }, [homePageContentHeight]);

    return (
        <div className={styles.sideBar} ref={sidebarRef}>
            {!isMobile && (
                <div className={styles.sideBar_main} ref={settingsRef}>
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
                <div className={styles.filters__item} ref={sortingRef}>
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

                <div className={styles.filters__item} ref={filtersRef}>
                    <Filters
                        height={filtersHeightCulced}
                        isOpen={filtersIsOpen}
                        setIsOpen={setFiltersIsOpen}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppSideBar;
