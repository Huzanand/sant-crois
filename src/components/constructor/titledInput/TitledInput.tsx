import styles from "./titledInput.module.css"

interface props {
    value: string;
    setValue?: (value: string) => void,
    placeholder?: string
}

export const TitledInput = ({value, setValue, placeholder='Text...', }: props) => {
    return (
        <div className={styles.input_container}>
            <input className={`body-l ${styles.input}`} type="text" placeholder={placeholder} value={value} onChange={setValue ? e => setValue(e.target.value): undefined} readOnly={setValue ? false : true}/>
        </div>
    )
}