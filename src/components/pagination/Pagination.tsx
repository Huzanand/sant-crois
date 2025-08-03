import styles from "./pagination.module.css";
import { PrevPage } from "@/assets/svg/icons";
import { useWindowWidth } from "@/utils/useWindowWidth";
import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect, useState } from "react";

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
    useEffect(() => {
        setLoadedPages([offset]);
    }, [offset]);

    const MOBILE_WIDTH = 650;

    const width = useWindowWidth();
    const isMobile = width <= MOBILE_WIDTH;

    const { t } = useLanguageSync();

    const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);

    const [loadedPages, setLoadedPages] = useState<number[]>([0]);

    useEffect(() => {
        if (offset + size >= Math.ceil((totalCount / initialSize) * 12)) {
            setLoadMoreDisabled(true);
        } else setLoadMoreDisabled(false);
    }, [offset, size, initialSize, totalCount]);

    const incPage = () => {
        if (
            offset + initialSize <=
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
                <div
                    className={styles.cell}
                    key={"prevPage"}
                    onClick={() => decPage()}
                >
                    <button
                        disabled={offset - initialSize + 1 < 0}
                        className={`${styles.btn}`}
                    >
                        <PrevPage disabled={offset - initialSize + 1 <= 0} />
                    </button>
                </div>
            );

            let start, end;

            if (countOfCells <= 7) {
                if (countOfCells % 2 === 0) {
                    const lSide = countOfCells / 2;

                    for (let i = 1; i <= lSide; i++) {
                        cells.push(
                            <div
                                className={`${styles.cell} ${styles.cellNum} ${
                                    loadedPages.includes(
                                        i * initialSize - initialSize
                                    )
                                        ? styles.active
                                        : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => {
                                    setOffset(i * initialSize - initialSize);
                                    setLoadedPages([
                                        i * initialSize - initialSize,
                                    ]);
                                }}
                            >
                                {i}
                            </div>
                        );
                    }

                    cells.push(
                        <button
                            disabled={loadMoreDisabled}
                            className={` ${styles.cell} buttons-s ${styles.loadMore}`}
                            key={`load more`}
                            onClick={() => handleLoadMore()}
                        >
                            {t("loadMore")}
                        </button>
                    );

                    for (let i = lSide + 1; i <= countOfCells; i++) {
                        cells.push(
                            <div
                                className={` ${styles.cell} ${styles.cellNum} ${
                                    loadedPages.includes(
                                        i * initialSize - initialSize
                                    )
                                        ? styles.active
                                        : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => {
                                    setOffset(i * initialSize - initialSize);
                                    setLoadedPages([
                                        i * initialSize - initialSize,
                                    ]);
                                }}
                            >
                                {i}
                            </div>
                        );
                    }
                } else {
                    const lSide = Math.ceil(countOfCells / 2);

                    for (let i = 1; i <= lSide; i++) {
                        cells.push(
                            <div
                                className={`${styles.cell} ${styles.cellNum} ${
                                    loadedPages.includes(
                                        i * initialSize - initialSize
                                    )
                                        ? styles.active
                                        : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => {
                                    setOffset(i * initialSize - initialSize);
                                    setLoadedPages([
                                        i * initialSize - initialSize,
                                    ]);
                                }}
                            >
                                {i}
                            </div>
                        );
                    }

                    cells.push(
                        <button
                            disabled={loadMoreDisabled}
                            className={` ${styles.cell} buttons-s ${styles.loadMore}`}
                            key={`load more`}
                            onClick={() => handleLoadMore()}
                        >
                            {t("loadMore")}
                        </button>
                    );

                    for (let i = lSide + 1; i <= countOfCells; i++) {
                        cells.push(
                            <div
                                className={`${styles.cell} ${styles.cellNum} ${
                                    loadedPages.includes(
                                        i * initialSize - initialSize
                                    )
                                        ? styles.active
                                        : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => {
                                    setOffset(i * initialSize - initialSize);
                                    setLoadedPages([
                                        i * initialSize - initialSize,
                                    ]);
                                }}
                            >
                                {i}
                            </div>
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
                    </div>
                );

                if (offset <= 3 * initialSize) {
                    start = 2;
                    end = Math.min(4, countOfCells - 4);
                } else if (offset >= countOfCells - 4) {
                    start = Math.max(2, countOfCells - 6);
                    end = countOfCells - 4;
                } else {
                    start = offset - initialSize;
                    end = offset + initialSize;
                }

                for (let i = start; i <= end; i++) {
                    cells.push(
                        <div
                            className={`${styles.cell} ${styles.cellNum} ${
                                offset === i * initialSize - initialSize
                                    ? styles.active
                                    : ""
                            }`}
                            key={"cell" + i}
                            onClick={() =>
                                setOffset(i * initialSize - initialSize)
                            }
                        >
                            {i}
                        </div>
                    );
                }

                cells.push(
                    <button
                        disabled={loadMoreDisabled}
                        className={` ${styles.cell} buttons-s ${styles.loadMore}`}
                        key={`load more`}
                        onClick={() => handleLoadMore}
                    >
                        {t("loadMore")}
                    </button>
                );

                for (let i = countOfCells - 3; i <= countOfCells; i++) {
                    cells.push(
                        <div
                            className={`${styles.cell} ${styles.cellNum} ${
                                offset === i * initialSize - initialSize
                                    ? styles.active
                                    : ""
                            }`}
                            key={"cell" + i}
                            onClick={() =>
                                setOffset(i * initialSize - initialSize)
                            }
                        >
                            {i}
                        </div>
                    );
                }
            }

            cells.push(
                <div
                    className={styles.cell}
                    key={"nextPage"}
                    onClick={() => incPage()}
                >
                    <button
                        disabled={
                            offset + 12 >
                            Math.ceil((totalCount / initialSize) * initialSize)
                        }
                        className={`${styles.btn} ${styles.btn__right}`}
                    >
                        <PrevPage
                            disabled={
                                offset + 12 >
                                Math.ceil(
                                    (totalCount / initialSize) * initialSize
                                )
                            }
                        />
                    </button>
                </div>
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
                          disabled={loadMoreDisabled}
                          className={`${styles.mob__button} buttons-s ${styles.loadMore}`}
                          key={"load more"}
                          onClick={() => setSize(initialSize)}
                      >
                          <span className="buttons-s blue-b500">
                              {t("loadMore")}
                          </span>
                      </button>
                  )
                : renderCells()}
        </div>
    );
};

export default Pagination;
