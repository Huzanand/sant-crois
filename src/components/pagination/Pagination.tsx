import styles from "./pagination.module.css";
import { PrevPage } from "@/assets/svg/icons";
import { useWindowWidth } from "@/utils/useWindowWidth";
import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect, useState } from "react";
import { useOwnStore } from "@/store/storeProvider";

type IPaginationProps = {
  totalCount: number;
  initialSize: number;
  size: number;
  offset: number;
  setOffset: (newPage: number) => void;
  setSize: (newPage: number) => void;
};

const Pagination: React.FC<IPaginationProps> = ({
  totalCount,
  initialSize,
  size,
  offset,
  setOffset,
  setSize,
}) => {
  const {
    activeTypeOfLesson,
    selectedLanguageLevel,
    selectedLearningLanguage,
    selectedPrimaryTopics,
    selectedSecondaryTopics,
    selectedTags,
    selectedAgeGroup,
    selectedSorting,
  } = useOwnStore((state) => state);

  useEffect(() => {
    setLoadedPages([offset]);
  }, [
    activeTypeOfLesson,
    selectedLanguageLevel,
    selectedLearningLanguage,
    selectedPrimaryTopics,
    selectedSecondaryTopics,
    selectedTags,
    selectedAgeGroup,
    selectedSorting,
    offset,
  ]);

  const MOBILE_WIDTH = 650;

  const width = useWindowWidth();
  const isMobile = width <= MOBILE_WIDTH;

  const { t } = useLanguageSync();

  const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);

  const [loadedPages, setLoadedPages] = useState<number[]>([0]);

  useEffect(() => {
    if (offset + size >= Math.ceil((totalCount / initialSize) * initialSize)) {
      setLoadMoreDisabled(true);
    } else {
      setLoadMoreDisabled(false);
    }
  }, [offset, size, initialSize, totalCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [offset]);

  const incPage = () => {
    if (
      offset + initialSize <
      Math.ceil((totalCount / initialSize) * initialSize)
    ) {
      const newOffset = offset + initialSize;

      setOffset(newOffset);
      setLoadedPages([newOffset]);
    }
  };

  const decPage = () => {
    if (offset - initialSize + 1 > 0) {
      const newOffset = offset - initialSize;

      setOffset(newOffset);
      setLoadedPages([newOffset]);
    }
  };

  const handleLoadMore = () => {
    setSize(initialSize);

    const newOffset = offset + size;

    setLoadedPages((prev) => [...prev, newOffset]);
  };

  const renderCells = () => {
    const countOfCells = Math.ceil(totalCount / initialSize);

    const cells = [];

    if (countOfCells > 1) {
      cells.push(
        <div className={styles.cell} key={"prevPage"} onClick={() => decPage()}>
          <button
            data-testid="prev-page-button"
            disabled={offset - initialSize + 1 < 0}
            className={`${styles.btn}`}
          >
            <PrevPage disabled={offset - initialSize + 1 <= 0} />
          </button>
        </div>,
      );

      let start;
      let end;

      const currentPage = offset / initialSize + 1;

      if (countOfCells <= 7) {
        if (countOfCells % 2 === 0) {
          const lSide = countOfCells / 2;

          for (let i = 1; i <= lSide; i++) {
            cells.push(
              <div
                className={`${styles.cell} ${styles.cellNum} ${
                  loadedPages.includes(i * initialSize - initialSize)
                    ? styles.active
                    : ""
                }`}
                key={"cell" + i}
                onClick={() => {
                  setOffset(i * initialSize - initialSize);
                  setLoadedPages([i * initialSize - initialSize]);
                }}
              >
                {i}
              </div>,
            );
          }

          cells.push(
            <button
              data-testid="load-more-button"
              disabled={loadMoreDisabled}
              className={` ${styles.cell} buttons-s ${styles.loadMore}`}
              key={`load more`}
              onClick={() => handleLoadMore()}
            >
              {t("loadMore")}
            </button>,
          );

          for (let i = lSide + 1; i <= countOfCells; i++) {
            cells.push(
              <div
                className={` ${styles.cell} ${styles.cellNum} ${
                  loadedPages.includes(i * initialSize - initialSize)
                    ? styles.active
                    : ""
                }`}
                key={"cell" + i}
                onClick={() => {
                  setOffset(i * initialSize - initialSize);
                  setLoadedPages([i * initialSize - initialSize]);
                }}
              >
                {i}
              </div>,
            );
          }
        } else {
          const lSide = Math.ceil(countOfCells / 2);

          for (let i = 1; i <= lSide; i++) {
            cells.push(
              <div
                className={`${styles.cell} ${styles.cellNum} ${
                  loadedPages.includes(i * initialSize - initialSize)
                    ? styles.active
                    : ""
                }`}
                key={"cell" + i}
                onClick={() => {
                  setOffset(i * initialSize - initialSize);
                  setLoadedPages([i * initialSize - initialSize]);
                }}
              >
                {i}
              </div>,
            );
          }

          cells.push(
            <button
              data-testid="load-more-button"
              disabled={loadMoreDisabled}
              className={` ${styles.cell} buttons-s ${styles.loadMore}`}
              key={`load more`}
              onClick={() => handleLoadMore()}
            >
              {t("loadMore")}
            </button>,
          );

          for (let i = lSide + 1; i <= countOfCells; i++) {
            cells.push(
              <div
                className={` ${styles.cell} ${styles.cellNum} ${
                  loadedPages.includes(i * initialSize - initialSize)
                    ? styles.active
                    : ""
                }`}
                key={"cell" + i}
                onClick={() => {
                  setOffset(i * initialSize - initialSize);
                  setLoadedPages([i * initialSize - initialSize]);
                }}
              >
                {i}
              </div>,
            );
          }
        }
      } else {
        cells.push(
          <div
            className={` ${styles.cell} ${styles.cellNum} ${
              offset === 0 ? styles.active : ""
            }`}
            key="cell1"
            onClick={() => {
              setOffset(0);
              setLoadedPages([0]);
            }}
          >
            1
          </div>,
        );

        /*
         * Dynamic page range.
         *
         * Example for 10 pages:
         *
         * page 1 → 1 2 3 4       7 8 9 10
         * page 2 → 1 2 3 4       7 8 9 10
         * page 3 → 1 2 3 4       7 8 9 10
         * page 4 → 1 3 4 5       7 8 9 10
         * page 5 → 1 4 5 6       7 8 9 10
         * page 6 → 1 4 5 6       7 8 9 10
         * page 7 → 1 4 5 6       7 8 9 10
         * page 8 → 1 4 5 6       7 8 9 10
         * page 9 → 1 4 5 6       7 8 9 10
         * page 10 → 1 4 5 6      7 8 9 10
         */

        if (currentPage <= 3) {
          start = 2;
          end = 4;
        } else {
          start = Math.min(currentPage - 1, countOfCells - 6);
          end = Math.min(currentPage + 1, countOfCells - 4);
        }

        for (let i = start; i <= end; i++) {
          cells.push(
            <div
              className={`${styles.cell} ${styles.cellNum} ${
                currentPage === i ? styles.active : ""
              }`}
              key={"cell" + i}
              onClick={() => setOffset(i * initialSize - initialSize)}
            >
              {i}
            </div>,
          );
        }

        cells.push(
          <button
            data-testid="load-more-button"
            disabled={loadMoreDisabled}
            className={` ${styles.cell} buttons-s ${styles.loadMore}`}
            key={`load more`}
            onClick={() => handleLoadMore()}
          >
            {t("loadMore")}
          </button>,
        );

        for (let i = countOfCells - 3; i <= countOfCells; i++) {
          cells.push(
            <div
              className={` ${styles.cell} ${styles.cellNum} ${
                currentPage === i ? styles.active : ""
              }`}
              key={"cell" + i}
              onClick={() => setOffset(i * initialSize - initialSize)}
            >
              {i}
            </div>,
          );
        }
      }

      cells.push(
        <div className={styles.cell} key={"nextPage"} onClick={() => incPage()}>
          <button
            data-testid="next-page-button"
            disabled={
              offset + initialSize >=
              Math.ceil((totalCount / initialSize) * initialSize)
            }
            className={`${styles.btn} ${styles.btn__right}`}
          >
            <PrevPage
              disabled={
                offset + initialSize >=
                Math.ceil((totalCount / initialSize) * initialSize)
              }
            />
          </button>
        </div>,
      );

      return cells;
    }

    return undefined;
  };

  return (
    <div className={styles.cell__container}>
      {isMobile && totalCount
        ? !loadMoreDisabled && (
            <button
              data-testid="load-more-button"
              disabled={loadMoreDisabled}
              className={`${styles.mob__button} buttons-s ${styles.loadMore}`}
              key={"load more"}
              onClick={() => setSize(initialSize)}
            >
              <span className="buttons-s blue-b500">{t("loadMore")}</span>
            </button>
          )
        : renderCells()}
    </div>
  );
};

export default Pagination;
