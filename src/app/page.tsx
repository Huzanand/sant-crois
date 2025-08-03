/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./page.module.css";

import { useOwnStore } from "@/store/storeProvider";
import { useEffect, useRef, useState } from "react";
import { ILesson } from "@/models";
import Card from "@/components/card/Card";

import Link from "next/link";
import AppSideBar from "@/components/appSidebar/AppSideBar";
import Pagination from "@/components/pagination/Pagination";
import { interceptorsStore } from "@/store/interceptorsStore";
import Skeleton from "@/components/skeleton/Skeleton";

const Home = () => {
    const {
        lessons,
        fetchLessons,
        fetchFilters,
        activeTypeOfLesson,
        selectedLanguageLevel,
        selectedLearningLanguage,
        selectedPrimaryTopics,
        selectedSecondaryTopics,
        selectedTags,
        selectedAgeGroup,
        offset,
        setOffset,
        size,
        setSize,
        totalCount,
        selectedSorting,
        setHomePageContentHeight,
    } = useOwnStore((state) => state);

    const loading = interceptorsStore((state) => state.loading);
    const error = interceptorsStore((state) => state.error);

    const contentRef = useRef<HTMLDivElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [contentHeight, setContentHeight] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        const contentEl = contentRef.current;

        if (!contentEl) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const height = entries[0].contentRect.height;

            setContentHeight(height);
            setHomePageContentHeight(height);
        });

        resizeObserver.observe(contentEl);

        return () => resizeObserver.disconnect();
    }, [setHomePageContentHeight]);

    useEffect(() => {
        fetchFilters();
    }, []);

    const [datasetKey, setDatasetKey] = useState<string>("");

    useEffect(() => {
        const newKey = JSON.stringify({
            activeTypeOfLesson,
            selectedLanguageLevel,
            selectedLearningLanguage,
            selectedPrimaryTopics,
            selectedSecondaryTopics,
            selectedTags,
            selectedAgeGroup,
            selectedSorting,
        });

        if (newKey !== datasetKey) {
            setDatasetKey(newKey);
            setOffset(0);
            setSize(0);
        }
    }, [
        activeTypeOfLesson,
        selectedLanguageLevel,
        selectedLearningLanguage,
        selectedSorting,
    ]);

    useEffect(() => {
        if (!datasetKey) return;

        fetchLessons(
            size,
            activeTypeOfLesson,
            selectedLanguageLevel,
            selectedLearningLanguage,
            selectedPrimaryTopics,
            selectedSecondaryTopics,
            selectedTags,
            selectedAgeGroup,
            offset,
            selectedSorting
        );
    }, [datasetKey, offset, size]);

    const showContent = () => {
        if (error || lessons === undefined) return <div>ERROERRRRR!!!!!</div>;
        if (loading) {
            return Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.content__item}>
                    <Skeleton />
                </div>
            ));
        }
        return lessons.map((item: ILesson) => {
            if (item) {
                return (
                    <div key={item.id} className={styles.content__item}>
                        <Link
                            key={"link" + item.id}
                            href={`/lesson/${item.id}`}
                            prefetch={false}
                        >
                            <Card
                                id={item.id}
                                header={item.header}
                                cover={item.cover as string}
                                primaryTopics={item.primaryTopics}
                                secondaryTopics={item.secondaryTopics}
                                learningLanguage={item.learningLanguage}
                                languageLevel={item.languageLevel}
                                acceptance={item.acceptance}
                                rating={item.rating}
                                views={item.views}
                                ageGroup={item.targetAgeGroup}
                            />
                        </Link>
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <div className={styles.sidebar__topContent}>
                        <AppSideBar />
                    </div>
                </div>

                <div className={styles.content} ref={contentRef}>
                    <div className={styles.content_box}>{showContent()}</div>
                </div>
            </div>
            <div className={styles.pagination_container}>
                <div
                    style={{
                        width: "346px",
                        flexShrink: "0",
                    }}
                />
                <Pagination
                    totalCount={totalCount}
                    initialSize={12}
                    size={size}
                    offset={offset}
                    setOffset={setOffset}
                    setSize={setSize}
                />
            </div>
        </div>
    );
};

export default Home;
