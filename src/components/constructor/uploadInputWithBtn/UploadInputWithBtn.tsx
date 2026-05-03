import styles from "./uploadInputWithBtn.module.css"
import { UploadIco } from "@/assets/svg/icons";
import { UploadInput } from "../uploadInput/UploadInput";
import { ButtonText } from "@/components/common/buttons/ButtonText";

interface props {
    type: 'audio' | 'image' | 'video',
    file?: File | null,
    setFile?: (file: File | null) => void,
    url: string | null,
    setUrl: (url: string) => void
}

export const UploadInputWithBtn = ({ type, url, setUrl, file, setFile }: props) => {

    const inputId = `file-upload-${type}-${file?.name}`;


    const isUsingLink = !!(url && url.length > 0 && !file);


    const isUsingFile = !!file;

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (setFile) {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
            }
            e.target.value = '';
        }
    };

    const removeFile = () => {
        if (setFile) {
            setFile(null);
        }
        setUrl('');
    };

    return (
        <>
            <div className={styles.input_container}>
                {type !== 'video' && (
                    <>
                        <input
                            id={inputId}
                            type="file"
                            accept={type === 'audio' ? "audio/*" : "image/*"}
                            onChange={handleOnChange}
                            disabled={isUsingLink}
                            className={styles.hidden_input}
                        />

                        <label htmlFor={inputId}
                            className={`
                                ${styles.custom_button} 
                                ${isUsingFile ? styles.dirtyBtn : ''} 
                                ${isUsingLink ? styles.disabledBtn : ''}
                            `}
                        >
                            <span className={`buttons-l blue-b500 ${isUsingLink ? styles.disabledBtn : ''}`}>upload</span>
                            <UploadIco fill={isUsingLink ? '#6C6698' : undefined} />
                        </label>
                    </>
                )}

                <UploadInput url={url ?? ''} setUrl={setUrl} disabled={isUsingFile} />
            </div>

            <div className={styles.status_wrapper}>
                {isUsingFile && (
                    <div className={styles.message_row}>
                        <p className={`body-s ${styles.confirmMessage}`}>
                            File added: {file?.name}
                        </p>
                        <div onClick={removeFile} className={styles.delete_text_btn}>
                            <ButtonText><span className="buttons-m">Delete file</span></ButtonText>
                        </div>
                    </div>
                )}

                {isUsingLink && (
                    <div className={styles.message_row}>
                        <p className={`body-s ${styles.confirmMessage}`}>
                            Link added successfully
                        </p>
                        <div onClick={() => setUrl('')} className={styles.delete_text_btn}>
                            <ButtonText><span className="buttons-m">Clear link</span></ButtonText>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}