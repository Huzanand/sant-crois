"use client";

import { useEffect, useRef, useState } from "react";
import animationData from "../../assets/animations/burger.json"; // Adjust path if needed
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import styles from "./burgerMenu.module.css";
import Logo from "../logo/Logo";
import HomePageView from "./HomePageView";
import LessonPageView from "./LessonPageView";

type ViewMode = "home" | "lesson";

interface BurgerProps {
    mode: ViewMode;
}

const BurgerMenu: React.FC<BurgerProps> = ({ mode }) => {
    const burgerRef = useRef<LottieRefCurrentProps>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (burgerRef.current) {
            burgerRef.current.setSpeed(4);
            if (isOpen) {
                burgerRef.current.playSegments([120, 0], true);
            } else {
                burgerRef.current.playSegments([0, 120], true);
            }
            setIsOpen(!isOpen);
        }
    };

    const handleOverlayClick = () => {
        handleClick();
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;

            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";

            if (overlayRef.current) {
                overlayRef.current.style.opacity = "1";
                overlayRef.current.style.pointerEvents = "auto";
            }
        } else {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";

            if (overlayRef.current) {
                overlayRef.current.style.opacity = "0";
                overlayRef.current.style.pointerEvents = "none";
            }
        }
    }, [isOpen]);

    const renderView = (mode: ViewMode) => {
        switch (mode) {
            case "home":
                return (
                    <HomePageView
                        handleOverlayClick={handleOverlayClick}
                        overlayRef={overlayRef}
                        isOpen={isOpen}
                    />
                );
            case "lesson":
                return (
                    <LessonPageView
                        handleOverlayClick={handleOverlayClick}
                        overlayRef={overlayRef}
                        isOpen={isOpen}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <div onClick={handleClick} style={{ cursor: "pointer" }}>
                    <Lottie
                        lottieRef={burgerRef}
                        animationData={animationData}
                        autoplay={false}
                        loop={false}
                        style={{
                            width: 46,
                            height: 46,
                            position: "relative",
                            zIndex: "6",
                        }}
                    />
                </div>
            </div>

            {renderView(mode)}
        </div>
    );
};

export default BurgerMenu;
