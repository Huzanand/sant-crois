"use client";

import styles from "./page.module.css";
import { useLanguageSync } from "@/utils/useLanguage";
import { interceptorsStore } from "@/store/interceptorsStore";
import Error404 from "@/components/error404/Error404";
import Sidebar from "@/containers/constructor/sidebar/Sidebar";
import ConstructorContent from "@/containers/constructor/constructorContent/ConstructorContent";
import { useState } from "react";
import LessonPreview from "@/containers/constructor/lessonPreview/LessonPreview";

const Constructor = () => {
    const [isPreview, setIsPreview] = useState(false);

    const error = interceptorsStore((state) => state.error);

    const { t } = useLanguageSync();

    return (
        <div className={styles.wrapper}>
            {error ? (
                <Error404 page="lesson" />
            ) : (
                <>

                    <div className={styles.container}>
                        <div className={styles.sideBar}>
                            <Sidebar onPreviewToggle={() => setIsPreview(!isPreview)} isPreview={isPreview} />
                        </div>

                        <div className={styles.content}> 
                            {isPreview ? (
                                <LessonPreview />
                            ) : (
                                <ConstructorContent />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Constructor;
