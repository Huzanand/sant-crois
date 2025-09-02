import styles from "./logo.module.css";
import Image from "next/image";
import logoTop from "../../assets/logoTop.svg";
import logoBottom from "../../assets/logoBottom.svg";
import { useRouter } from "next/navigation";

const Logo = ({ footer = false }) => {
    const router = useRouter();
    return (
        <div className={styles.sideBar_headings} style={{ cursor: "pointer" }}>
            <div onClick={() => router.back()}>
                {footer ? (
                    <Image src={logoBottom.src} alt="" width={98} height={68} />
                ) : (
                    <Image src={logoTop.src} alt="" width={133} height={40} />
                )}
            </div>
        </div>
    );
};

export default Logo;
