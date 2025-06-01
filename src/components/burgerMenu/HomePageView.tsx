import styles from "./burgerMenu.module.css";
import TypeOfLesson from "../typeOfLesson/TypeOfLesson";
import Divider from "../divider/Divider";
import Settings from "../settings/Settings";

interface vievProps {
    handleOverlayClick: () => void;
    overlayRef: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
}

const HomePageView: React.FC<vievProps> = ({
    handleOverlayClick,
    overlayRef,
    isOpen,
}) => {
    return (
        <div className={styles.content}>
            {/* Overlay for mobile */}
            <div
                ref={overlayRef}
                className={styles.overlay}
                onClick={handleOverlayClick}
            />
            <div
                className={
                    isOpen
                        ? `${styles.content__container} ${styles.open}`
                        : styles.content__container
                }
            >
                <div>
                    <h6 className={styles.headlines_title}>French Book</h6>
                    <p className={styles.headlines_subtitle}>Let`s study!</p>
                </div>

                <TypeOfLesson />

                <Divider />

                <Settings />
            </div>
        </div>
    );
};

export default HomePageView;
