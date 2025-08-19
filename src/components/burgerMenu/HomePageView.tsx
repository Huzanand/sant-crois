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
                <div className={styles.header}>
                    <h6 className={styles.headlines_title}>French Book</h6>
                    <p className={styles.headlines_subtitle}>Let`s study!</p>
                </div>

                <section style={{ padding: "0 1rem" }}>
                    <TypeOfLesson />

                    <Divider />

                    <Settings />
                </section>
            </div>
        </div>
    );
};

export default HomePageView;
