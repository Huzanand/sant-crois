import styles from './logo.module.css'
import Image from "next/image"
import logo from "../../assets/Avatar.png";


const Logo = ({footer = false}) => {

    return (
        <div className={styles.sideBar_headings}>
            <div>
                <Image src={logo.src} alt="" width={40} height={40} />
            </div>
            <div>
                <h6 className={footer ? `${styles.headlines_title} ${styles.colorFFF}` : styles.headlines_title}>French Book</h6>
                <p className={footer ? `${styles.headlines_subtitle} ${styles.colorFFF}` : styles.headlines_subtitle}>
                    Let`s study!
                </p>
            </div>
        </div>
    )
}

export default Logo