import { useOwnStore } from "@/store/storeProvider";
import SearchComponent from "../searchComponent/SearchComponent";
import styles from "./filters.module.css";
import Divider from "../divider/Divider";
import AgeFilter from "../ageFilter/AgeFilter";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIco, FilterIco } from "@/assets/svg/icons";
import { useWindowWidth } from "@/utils/useWindowWidth";
import { useLanguageSync } from "@/utils/useLanguage";

interface IFiltersProps {
    height: number;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters: React.FC<IFiltersProps> = ({ height, isOpen, setIsOpen }) => {
    const primaryTopics = useOwnStore((state) => state.primaryTopics);
    const selectedPrimaryTopics = useOwnStore(
        (state) => state.selectedPrimaryTopics
    );
    const setSelectedPrimaryTopics = useOwnStore(
        (state) => state.setSelectedPrimaryTopics
    );

    const secondaryTopics = useOwnStore((state) => state.secondaryTopics);
    const selectedSecondaryTopics = useOwnStore(
        (state) => state.selectedSecondaryTopics
    );
    const setSelectedSecondaryTopics = useOwnStore(
        (state) => state.setSelectedSecondaryTopics
    );

    const tags = useOwnStore((state) => state.tags);
    const selectedTags = useOwnStore((state) => state.selectedTags);
    const setSelectedTags = useOwnStore((state) => state.setSelectedTags);

    const targetAgeGroups = useOwnStore((state) => state.targetAgeGroups);
    const selectedAgeGroup = useOwnStore((state) => state.selectedAgeGroup);
    const setSelectedAgeGroup = useOwnStore(
        (state) => state.setSelectedAgeGroup
    );

    const MOBILE_WIDTH = 965;
    const width = useWindowWidth();
    const isMobile = width <= MOBILE_WIDTH;
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const [isActive, setIsActive] = useState(false);

    const titleClass = `buttons-l ${styles.title}`;

    const { t } = useLanguageSync();

    useEffect(() => {
        if (isOpen && isMobile) {
            const scrollY = window.scrollY;

            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";

            if (overlayRef.current) {
                overlayRef.current.style.opacity = "1";
                overlayRef.current.style.pointerEvents = "auto";
            }

            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                document.body.style.overflow = "";

                if (overlayRef.current) {
                    overlayRef.current.style.opacity = "0";
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    overlayRef.current.style.pointerEvents = "none";
                }
            };
        }
    }, [isOpen, isMobile]);

    const toggleDropdown = () => {
        const container = containerRef.current;

        if (container) {
            setIsActive(!isActive);
            setIsOpen(!isOpen);
        }
    };

    const handleOverlayClick = () => {
        toggleDropdown();
    };

    return (
        <div className={styles.container}>
            {isMobile && (
                <div
                    ref={overlayRef}
                    className={styles.overlay}
                    onClick={handleOverlayClick}
                />
            )}

            <div
                onClick={toggleDropdown}
                className={
                    isActive
                        ? `${styles.header__container} ${styles.active}`
                        : styles.header__container
                }
            >
                <div className={styles.header_content}>
                    <div className={styles.icon_selected}>
                        <FilterIco fill={isActive ? "#fff" : undefined} />
                    </div>
                    <p
                        className={
                            isActive
                                ? `${titleClass} ${styles.active}`
                                : titleClass
                        }
                    >
                        {t("filters")}
                    </p>
                </div>

                <div className={styles.icon_appearance}>
                    <ArrowDownIco fill={isActive ? "#fff" : undefined} />
                </div>
            </div>

            <div
                className={
                    isOpen
                        ? `${styles.content__container} ${styles.open}`
                        : styles.content__container
                }
                ref={containerRef}
                style={{
                    maxHeight: isOpen ? `${height}px` : "0px",
                    transition: "max-height 0.3s ",
                    overflowY: "auto",
                }}
            >
                {isMobile && (
                    <div
                        className={styles.modal_header}
                        onClick={toggleDropdown}
                    >
                        <button className={styles.back_button}>
                            <ArrowDownIco />
                        </button>
                        <h3 className={styles.modal_title}>Сортировать по</h3>
                    </div>
                )}

                {isOpen && (
                    <>
                        <SearchComponent
                            label={t("main theme")}
                            arr={primaryTopics}
                            selectedFromArr={selectedPrimaryTopics}
                            setFunc={setSelectedPrimaryTopics}
                        />

                        <Divider margin="16px 0" />

                        <SearchComponent
                            label={t("secondary theme")}
                            arr={secondaryTopics}
                            selectedFromArr={selectedSecondaryTopics}
                            setFunc={setSelectedSecondaryTopics}
                        />

                        <Divider margin="16px 0" />

                        <SearchComponent
                            label={t("tags")}
                            arr={tags}
                            selectedFromArr={selectedTags}
                            setFunc={setSelectedTags}
                        />

                        <Divider margin="16px 0" />

                        <AgeFilter
                            label={t("age group")}
                            arr={targetAgeGroups}
                            selectedFromArr={selectedAgeGroup}
                            setFunc={setSelectedAgeGroup}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Filters;
