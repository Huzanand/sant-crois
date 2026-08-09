import { useOwnStore } from "@/store/storeProvider";
import SearchComponent from "../searchComponent/SearchComponent";
import styles from "./filters.module.css";
import Divider from "../divider/Divider";
import AgeFilter from "../ageFilter/AgeFilter";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIco, FilterIco } from "@/assets/svg/icons";
import { useWindowWidth } from "@/utils/useWindowWidth";
import { useLanguageSync } from "@/utils/useLanguage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IFiltersProps {
  height: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FILTER_KEYS = [
  "primaryTopics",
  "secondaryTopics",
  "tags",
  "targetAgeGroup",
];

const Filters: React.FC<IFiltersProps> = ({ height, isOpen, setIsOpen }) => {
  const {
    fetchLessons,
    selectedLanguageLevel,
    selectedLearningLanguage,
    offset,
    size,
    primaryTopics,
    secondaryTopics,
    tags,
    targetAgeGroups,
    resetFiltersIndex,
  } = useOwnStore((state) => state);

  const MOBILE_WIDTH = 1012;
  const width = useWindowWidth();
  const isMobile = width <= MOBILE_WIDTH;
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);

  const titleClass = `buttons-l ${styles.title}`;

  const { t } = useLanguageSync();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>(
    {},
  );

  useEffect(() => {
    const initialDraft: Record<string, string[]> = {};
    FILTER_KEYS.forEach((key) => {
      const val = searchParams.get(key);
      initialDraft[key] = val ? val.split(",") : [];
    });
    setDraftFilters(initialDraft);
  }, [searchParams]);

  const handleToggle = (key: string, value: string) => {
    setDraftFilters((prev) => {
      const currentList = prev[key] || [];
      const updatedList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];

      return { ...prev, [key]: updatedList };
    });
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(draftFilters).forEach(([key, values]) => {
      if (values.length === 0) {
        params.delete(key);
      } else {
        params.set(key, values.join(","));
      }
    });

    params.set("offset", "0");

    const updatedQueryString = params.toString();
    router.replace(`${pathname}?${updatedQueryString}`, { scroll: false });

    fetchLessons(
      size,
      selectedLanguageLevel,
      selectedLearningLanguage,
      updatedQueryString,
      offset,
    );

    toggleDropdown();
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));

    setDraftFilters({});
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (isOpen && isMobile) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      const ref = overlayRef.current;

      if (ref) {
        ref.style.opacity = "1";
        ref.style.pointerEvents = "auto";
      }

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        if (ref) {
          ref.style.opacity = "0";
          ref.style.pointerEvents = "none";
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

  useEffect(() => {}, [resetFiltersIndex]);

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
            className={isActive ? `${titleClass} ${styles.active}` : titleClass}
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
          maxHeight: isOpen ? `${height - 69}px` : "0px",
          minHeight: isMobile ? "100dvh" : "auto",
          transition: "max-height 0.3s ",
          overflowY: "auto",
        }}
      >
        {isMobile && (
          <div className={styles.modal_header} onClick={toggleDropdown}>
            <button className={styles.back_button}>
              <ArrowDownIco />
            </button>
            <h3 className={styles.modal_title}>Сортировать по</h3>
          </div>
        )}

        {isOpen && (
          <>
            <SearchComponent
              key={`primary-${resetFiltersIndex}`}
              label={t("main theme")}
              arr={primaryTopics}
              selectedValues={draftFilters["primaryTopics"] || []}
              onToggle={(val) => handleToggle("primaryTopics", val)}
            />

            <Divider margin="16px 0" />

            <SearchComponent
              key={`secondary-${resetFiltersIndex}`}
              label={t("secondary theme")}
              arr={secondaryTopics}
              selectedValues={draftFilters["secondaryTopics"] || []}
              onToggle={(val) => handleToggle("secondaryTopics", val)}
            />

            <Divider margin="16px 0" />

            <SearchComponent
              key={`tags-${resetFiltersIndex}`}
              label={t("tags")}
              arr={tags}
              selectedValues={draftFilters["tags"] || []}
              onToggle={(val) => handleToggle("tags", val)}
            />

            <Divider margin="16px 0" />

            <AgeFilter
              key={`age-${resetFiltersIndex}`}
              label={t("age group")}
              arr={targetAgeGroups}
              selectedValues={draftFilters["targetAgeGroups"]}
              onToggle={(val: string) => handleToggle("targetAgeGroups", val)}
            />

            <div
              className={styles.btn_container}
              style={{ paddingBottom: isMobile ? "60px" : "" }}
            >
              <div className={styles.btn_block}>
                <button
                  className={`buttons-l ${styles.btn} ${styles.btn_apply}`}
                  onClick={() => {
                    handleApply();
                    toggleDropdown();
                  }}
                >
                  {t("apply")}
                </button>
              </div>
              <div className={styles.btn_block}>
                <button
                  className={`buttons-l ${styles.btn}`}
                  onClick={() => {
                    handleClearFilters();
                    toggleDropdown();
                  }}
                >
                  {t("reset")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Filters;
