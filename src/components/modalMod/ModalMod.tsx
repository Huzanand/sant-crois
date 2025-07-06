import { useEffect, useRef, useState } from "react";
import styles from "./modalMob.module.css";
import { CloseModalIco } from "@/assets/svg/icons";

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    title?: string;
    content?: React.ReactNode;
    style?: React.CSSProperties;
    underline?: boolean;
}

const ModalMob: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    content,
    style,
    underline,
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef<number>(0);

    useEffect(() => {
        if (isOpen !== undefined) {
            setShowModal(isOpen);
        }
    }, [isOpen]);

    const toggleModal = () => {
        const newState = !showModal;
        setShowModal(newState);
        if (!newState && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (showModal) {
            scrollYRef.current = window.scrollY;

            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollYRef.current}px`;
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
            window.scrollTo(0, scrollYRef.current);

            if (overlayRef.current) {
                overlayRef.current.style.opacity = "0";
                overlayRef.current.style.pointerEvents = "none";
            }
        }
    }, [showModal]);

    return (
        <div className={styles.container}>
            <span
                className={underline ? "body-m--underline" : "body-m"}
                onClick={toggleModal}
            >
                {children}
            </span>

            <div
                ref={overlayRef}
                className={styles.overlay}
                onClick={toggleModal}
            />

            <div
                className={`${styles.content__container} ${
                    showModal ? styles.open : undefined
                }`}
                style={style}
            >
                <div
                    className={`pos-center ${styles.closeIco}`}
                    onClick={toggleModal}
                >
                    <CloseModalIco />
                </div>
                <div className={styles.content}>
                    {title && (
                        <h4 className="body-l" style={{ marginBottom: "1rem" }}>
                            {title}
                        </h4>
                    )}
                    {content && <p className="body-m">{content}</p>}
                </div>
            </div>
        </div>
    );
};

export default ModalMob;
