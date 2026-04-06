import styles from "./lessonInfoContainer.module.css"

interface inputProps {
    title: string;
    description?: string;
    required?: boolean;
    children: React.ReactNode
}

export const LessonInfoContainer: React.FC<inputProps> = ({ title, description, required, children }) => {

    const modificatedTitle = required ? `${title}*` : title;

   

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <p className='headlines-m b-500'>{modificatedTitle}</p>
                {description && <p className={`body-m ${styles.description}`}>{description}</p>}
            </div>
            <div className={styles.input_container}>
                {children}
            </div>
        </div>
    )
}