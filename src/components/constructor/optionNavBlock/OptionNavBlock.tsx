import styles from "./optionNavBlock.module.css"
import { ArrowDownIco, TrashCanIco } from "@/assets/svg/icons";

export const OptionNavBlock = ({ id, handleDelete, handleUp, handleDown }
    : {
        id?: string,
        handleDelete: (target?: any) => void,
        handleUp: (id?: any) => void,
        handleDown: (id?: any) => void
    }
) => (
    <div className={styles.navBlock}>
        <div className={`${styles.navBlock_item} ${styles.trashIco}`} onClick={() => handleDelete(id)}>
            <TrashCanIco />
        </div>
        <div className={`${styles.navBlock_item} ${styles.arrowUp}`} onClick={() => handleUp(id)}>
            <ArrowDownIco fill="#231E49" />
        </div>
        <div className={`${styles.navBlock_item} ${styles.arrowDown}`} onClick={() => handleDown(id)}>
            <ArrowDownIco fill="#231E49" />
        </div>
    </div>
)