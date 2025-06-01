"use client";

import styles from "./page.module.css";

import { useOwnStore } from "@/store/storeProvider";
import { useEffect } from "react";
import { ILesson } from "@/models";
import Card from "@/components/card/Card";

import Link from "next/link";
import AppSideBar from "@/components/appSidebar/AppSideBar";
import Pagination from "@/components/pagination/Pagination";

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
        page,
        setPage,
        size,
        setSize,
        totalCount,
        selectedSorting,
    } = useOwnStore((state) => state);

    useEffect(() => {
        fetchFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchLessons(
            size,
            activeTypeOfLesson,
            selectedLanguageLevel,
            selectedLearningLanguage,
            selectedPrimaryTopics,
            selectedSecondaryTopics,
            selectedTags,
            selectedAgeGroup,
            page,
            selectedSorting
        );
    }, [
        page,
        activeTypeOfLesson,
        selectedLanguageLevel,
        selectedLearningLanguage,
        selectedPrimaryTopics,
        selectedSecondaryTopics,
        selectedTags,
        selectedAgeGroup,
        size,
        fetchLessons,
        selectedSorting,
    ]);

    return (
        <div className={styles.container}>
            <div className={styles.sideBar}>
                <div className={styles.sidebar__topContent}>
                    <AppSideBar />
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.content_box}>
                    {lessons !== undefined &&
                        lessons.map((item: ILesson) => {
                            if (item) {
                                return (
                                    <div
                                        key={item.id}
                                        className={styles.content__item}
                                    >
                                        <Link
                                            key={"link" + item.id}
                                            href={`/lesson/${item.id}`}
                                            prefetch={false}
                                        >
                                            <Card
                                                id={item.id}
                                                header={item.header}
                                                cover={item.cover as string}
                                                primaryTopics={
                                                    item.primaryTopics
                                                }
                                                secondaryTopics={
                                                    item.secondaryTopics
                                                }
                                                learningLanguage={
                                                    item.learningLanguage
                                                }
                                                languageLevel={
                                                    item.languageLevel
                                                }
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
                        })}
                </div>
                <Pagination
                    totalCount={totalCount}
                    size={12}
                    page={page}
                    setPage={setPage}
                    setSize={setSize}
                />
            </div>
        </div>
    );
};

export default Home;
