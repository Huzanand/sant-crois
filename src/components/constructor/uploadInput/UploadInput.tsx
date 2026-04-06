import { CheckMarkIco } from "@/assets/svg/icons"
import styles from "./uploadInput.module.css"

interface props {
    url: string
    setUrl: (value: string) => void,
    disabled: boolean
}

export const UploadInput = ({ url, setUrl, disabled }: props) => {
    return (
        <div className={styles.input_container}>
            <div className={styles.input_container__inner}>
                <input
                    name='url'
                    className={`body-l ${styles.urlInput}`}
                    type='text' value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder='https://...'
                    disabled={disabled}
                />
                
                {url && (
                    <div className={styles.checkMark}>
                        <CheckMarkIco />
                    </div>
                )}
            </div>

        </div>
    )
}