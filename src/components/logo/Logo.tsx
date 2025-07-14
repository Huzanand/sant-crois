import styles from "./logo.module.css";
import Image from "next/image";
import logoTop from "../../assets/logoTop.svg";
import logoBottom from "../../assets/logoBottom.svg";

const Logo = ({ footer = false }) => {
    return (
        <div className={styles.sideBar_headings}>
            <div>
                {footer ? (
                    <Image src={logoBottom.src} alt="" width={98} height={68} />
                ) : (
                    <Image src={logoTop.src} alt="" width={133} height={40} />
                )}
            </div>
            {/* <div>
                <h6
                    className={
                        footer
                            ? `${styles.headlines_title} ${styles.colorFFF}`
                            : styles.headlines_title
                    }
                >
                    Sant Crois
                </h6>
                <p
                    className={
                        footer
                            ? `${styles.headlines_subtitle} ${styles.colorFFF}`
                            : styles.headlines_subtitle
                    }
                >
                    Let’s study!
                </p>
            </div> */}
        </div>
    );
};

export default Logo;
