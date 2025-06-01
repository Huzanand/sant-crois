import { useOwnStore } from "@/store/storeProvider";
import styles from "./burgerMenu.module.css";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import { InterfaceLanguageIco } from "@/assets/svg/icons";
import useTranslatedOptions from "@/utils/useTranslatedOptions";
import { useLanguageSync } from "@/utils/useLanguage";

interface vievProps {
    handleOverlayClick: () => void;
    overlayRef: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
}

const LessonPageView: React.FC<vievProps> = ({
    handleOverlayClick,
    overlayRef,
    isOpen,
}) => {
    const {
        onSelectChange,
        selectedInterfaceLanguage,
        interfaceLanguageOptions,
    } = useOwnStore((state) => state);

    const { t } = useLanguageSync();

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

                <div className={styles.settingsMenu}>
                    <div>
                        <SettingsSelect
                            mode="default"
                            selectedOption={selectedInterfaceLanguage}
                            selectedOptionLabel={t(
                                `selectedInterfaceLanguage.${selectedInterfaceLanguage}`
                            )}
                            options={useTranslatedOptions(
                                interfaceLanguageOptions,
                                "interfaceLanguageOptions"
                            )}
                            onChangeSelect={onSelectChange}
                            changeField="selectedInterfaceLanguage"
                            ico={<InterfaceLanguageIco />}
                            activeIcon={<InterfaceLanguageIco fill="#fff" />}
                            shadow
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPageView;
