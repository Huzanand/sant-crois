"use client";
import style from "./page.module.css";
import { useRouter } from "next/navigation";
import CreateVRForm from "../../modal/page";
import { useEffect } from "react";

export default function LessonModal() {
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleClick = () => {
        router.back();
    };

    return (
        <div className={style.wrapper} onClick={handleClick}>
            <div
                className={style.container}
                onClick={(e) => e.stopPropagation()}
            >
                <CreateVRForm nopadding />
            </div>
        </div>
    );
}
