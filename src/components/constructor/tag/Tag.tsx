import { CrossIco } from '@/assets/svg/icons';
import styles from './tag.module.css'

interface tagProps {
    title: string;
    onClose: React.MouseEventHandler<HTMLButtonElement>
}

export const Tag: React.FC<tagProps> = ({title, onClose}) => {

    return (
        <div className={styles.container}>
            <span className={`body-s ${styles.title}`}>{title}</span>
            <button className={styles.btn} onClick={onClose}><CrossIco/></button>
        </div>
    )
}