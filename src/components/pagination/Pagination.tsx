import { useState } from "react";
import styles from "./pagination.module.css";
import { PrevPage } from "@/assets/svg/icons";
import { useWindowWidth } from "@/utils/useWindowWidth";
import { useLanguageSync } from "@/utils/useLanguage";

type IPaginationProps = {
    totalCount: number;
    size: number;
    page: number;
    setPage: (newPage: number) => void;
    setSize: (newPage: number) => void;
};

const Pagination: React.FC<IPaginationProps> = ({
    totalCount,
    size,
    // page,
    // setPage,
    setSize,
}) => {
    const [testPage, setTestPage] = useState(1);

    const MOBILE_WIDTH = 650;

    const width = useWindowWidth();
    const isMobile = width <= MOBILE_WIDTH;

    const { t } = useLanguageSync();

    const incPage = () => {
        if (testPage + 1 <= Math.ceil(totalCount / size)) {
            setTestPage(testPage + 1);
        }
    };

    const decPage = () => {
        if (testPage > 1) {
            setTestPage(testPage - 1);
        }
    };

    const renderCells = () => {
        const countOfCells = Math.ceil(totalCount / size);

        const cells = [];

        if (countOfCells > 1) {
            cells.push(
                <div
                    className={styles.cell}
                    key={"prevPage"}
                    onClick={() => decPage()}
                >
                    <button
                        disabled={testPage <= 1}
                        className={`${styles.btn}`}
                    >
                        <PrevPage disabled={testPage <= 1} />
                    </button>
                </div>
            );

            let start, end;

            if (countOfCells <= 7) {
                if (countOfCells % 2 === 0) {
                    console.log(countOfCells + "  eval");
                    const lSide = countOfCells / 2;

                    for (let i = 1; i <= lSide; i++) {
                        cells.push(
                            <div
                                className={`${styles.cell} ${styles.cellNum} ${
                                    testPage === i ? styles.active : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => setTestPage(i)}
                            >
                                {i}
                            </div>
                        );
                    }

                    cells.push(
                        <div
                            className={` ${styles.cell} buttons-s ${styles.loadMore}`}
                            key={"load more"}
                            onClick={() => setSize(12)}
                        >
                            Load more
                        </div>
                    );

                    for (let i = lSide + 1; i <= countOfCells; i++) {
                        cells.push(
                            <div
                                className={` ${styles.cell} ${styles.cellNum} ${
                                    testPage === i ? styles.active : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => setTestPage(i)}
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
                                    testPage === i ? styles.active : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => setTestPage(i)}
                            >
                                {i}
                            </div>
                        );
                    }

                    cells.push(
                        <div
                            className={`${styles.cell} buttons-s ${styles.loadMore}`}
                            key={"load more"}
                            onClick={() => setSize(12)}
                        >
                            Load more
                        </div>
                    );

                    for (let i = lSide + 1; i <= countOfCells; i++) {
                        cells.push(
                            <div
                                className={`${styles.cell} ${styles.cellNum} ${
                                    testPage === i ? styles.active : ""
                                }`}
                                key={"cell" + i}
                                onClick={() => setTestPage(i)}
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
                            testPage === 1 ? styles.active : ""
                        }`}
                        key="cell1"
                        onClick={() => setTestPage(1)}
                    >
                        1
                    </div>
                );

                if (testPage <= 3) {
                    start = 2;
                    end = Math.min(4, countOfCells - 4);
                } else if (testPage >= countOfCells - 4) {
                    start = Math.max(2, countOfCells - 6);
                    end = countOfCells - 4;
                } else {
                    start = testPage - 1;
                    end = testPage + 1;
                }

                for (let i = start; i <= end; i++) {
                    cells.push(
                        <div
                            className={`${styles.cell} ${styles.cellNum} ${
                                testPage === i ? styles.active : ""
                            }`}
                            key={"cell" + i}
                            onClick={() => setTestPage(i)}
                        >
                            {i}
                        </div>
                    );
                }

                cells.push(
                    <div
                        className={`${styles.cell} buttons-s ${styles.loadMore}`}
                        key={"load more"}
                        onClick={() => setSize(12)}
                    >
                        {t("loadMore")}
                    </div>
                );

                for (let i = countOfCells - 3; i <= countOfCells; i++) {
                    cells.push(
                        <div
                            className={`${styles.cell} ${styles.cellNum} ${
                                testPage === i ? styles.active : ""
                            }`}
                            key={"cell" + i}
                            onClick={() => setTestPage(i)}
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
                        disabled={testPage + 1 > Math.ceil(totalCount / size)}
                        className={`${styles.btn} ${styles.btn__right}`}
                    >
                        <PrevPage
                            disabled={
                                testPage + 1 > Math.ceil(totalCount / size)
                            }
                        />
                    </button>
                </div>
            );

            return cells;
        }
    };

    // const renderCells = () => {
    //     const countOfCells = Math.ceil(totalCount / size);

    //     const cells = [];

    //     cells.push(
    //         <div
    //             className={styles.cell}
    //             key={"prevPage"}
    //             onClick={() => decPage()}
    //         >
    //             <button disabled={testPage <= 1} className={styles.btn}>
    //                 <PrevPage disabled={testPage <= 1} />
    //             </button>
    //         </div>
    //     );

    //     cells.push(
    //         <div
    //             className={`${styles.cell} ${testPage === 1 ? styles.active : ""
    //                 }`}
    //             key="cell1"
    //             onClick={() => setTestPage(1)}
    //         >
    //             1
    //         </div>
    //     );

    //     let start, end;

    //     if (testPage <= 3) {
    //         start = 2;
    //         end = Math.min(4, countOfCells - 4);
    //     } else if (testPage >= countOfCells - 4) {
    //         start = Math.max(2, countOfCells - 7);
    //         end = countOfCells - 4;
    //     } else {
    //         start = testPage - 1;
    //         end = testPage + 1;
    //     }

    //     for (let i = start; i <= end; i++) {
    //         cells.push(
    //             <div
    //                 className={`${styles.cell} ${styles.cellNum} ${testPage === i ? styles.active : ""
    //                     }`}
    //                 key={"cell" + i}
    //                 onClick={() => setTestPage(i)}
    //             >
    //                 {i}
    //             </div>
    //         );
    //     }

    //     cells.push(
    //         <div
    //             className={`${styles.cell} buttons-s ${styles.loadMore}`}
    //             key={"load more"}
    //             onClick={() => setSize(12)}
    //         >
    //             Load more
    //         </div>
    //     );

    //     for (let i = countOfCells - 3; i <= countOfCells; i++) {
    //         cells.push(
    //             <div
    //                 className={`${styles.cell} ${styles.cellNum} ${testPage === i ? styles.active : ""
    //                     }`}
    //                 key={"cell" + i}
    //                 onClick={() => setTestPage(i)}
    //             >
    //                 {i}
    //             </div>
    //         );
    //     }

    //     cells.push(
    //         <div
    //             className={styles.cell}
    //             key={"nextPage"}
    //             onClick={() => incPage()}
    //         >
    //             <button
    //                 disabled={testPage + 1 > Math.ceil(totalCount / size)}
    //                 className={`${styles.btn} ${styles.btn__right}`}
    //             >
    //                 <PrevPage
    //                     disabled={testPage + 1 > Math.ceil(totalCount / size)}
    //                 />
    //             </button>
    //         </div>
    //     );

    //     return cells;
    // };

    // const incPage = () => {
    //     if (page + 1 <= Math.ceil(totalCount / size)) {
    //         setPage(page + 1)
    //     }
    // }

    // const decPage = () => {
    //     if (page > 1) {
    //         setPage(page - 1)
    //     }
    // }

    // const renderCells = () => {
    //     const countOfCells = Math.ceil(totalCount / size);

    //     const cells = [];

    //     cells.push(
    //         <div className={styles.cell} key={'prevPage'} onClick={() => decPage()}>
    //             <button disabled={(page <= 1)} className={styles.btn}>
    //                 <PrevPage disabled={(page <= 1)} />
    //             </button>
    //         </div>
    //     );

    //     cells.push(
    //         <div
    //             className={`${styles.cell} ${styles.cellNum} ${page === 1 ? styles.active : ""}`}
    //             key="cell1"
    //             onClick={() => setPage(1)}
    //         >
    //             1
    //         </div>
    //     );

    //     let start, end;

    //     if (page <= 3) {
    //         start = 2;
    //         end = Math.min(4, countOfCells - 1);
    //     } else if (page >= countOfCells - 2) {
    //         start = Math.max(countOfCells - 3, 2);
    //         end = countOfCells - 1;
    //     } else {
    //         start = page - 1;
    //         end = page + 1;
    //     }

    //     for (let i = start; i <= end; i++) {
    //         cells.push(
    //             <div
    //                 className={`${styles.cell} ${styles.cellNum} ${page === i ? styles.active : ""}`}
    //                 key={"cell" + i}
    //                 onClick={() => setPage(i)}
    //             >
    //                 {i}
    //             </div>
    //         );
    //     }

    //     cells.push(
    //         <div className={`${styles.cell} buttons-s ${styles.loadMore}`} key={'load more'}
    //             onClick={() => setSize(12)}
    //         >
    //             Load more
    //         </div>
    //     )

    //     cells.push(
    //         <div className={`${styles.cell} buttons-s`} key={'cell...'}>
    //             ...
    //         </div>
    //     )

    //     cells.push(
    //         <div className={`${styles.cell} buttons-s ${countOfCells === page ? styles.active : ''} ${false ? styles.hide : ''}`} key={'cell' + countOfCells}
    //             onClick={() => setPage(countOfCells)}
    //         >
    //             {countOfCells}
    //         </div>
    //     )

    //     cells.push(
    //         <div className={styles.cell} key={'nextPage'} onClick={() => incPage()}>
    //             <button disabled={(page + 1 > Math.ceil(totalCount / size))} className={`${styles.btn} ${styles.btn__right}`}>
    //                 <PrevPage disabled={(page + 1 > Math.ceil(totalCount / size))} />
    //             </button>
    //         </div>
    //     );

    //     return cells
    // }

    return (
        <div className={styles.cell__container}>
            {isMobile ? (
                <div
                    className={`${styles.mob__button} buttons-s ${styles.loadMore}`}
                    key={"load more"}
                    onClick={() => setSize(12)}
                >
                    <span className="buttons-s blue-b500">{t("loadMore")}</span>
                    {/* <span className="buttons-s blue-b500">Load more</span> */}
                </div>
            ) : (
                renderCells()
            )}
        </div>
    );
};

export default Pagination;
