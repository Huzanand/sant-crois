import Lottie from "lottie-react";
import styles from "./loader.module.css";
import animationData from "../../assets/animations/loader.json";

const Loader = () => {
    return (
        <div className={`${styles.wrapper} pos-center`}>
            <div className={styles.container}>
                <h2 className="headlines-m">Урок закончен</h2>
                <h3 className="headlines-s">
                    Подождите пожалуйста, идет обработка ваших ответов
                </h3>
                <div className={styles.loader__gif}>
                    <Lottie
                        animationData={animationData}
                        autoplay={true}
                        loop={true}
                        style={{
                            maxWidth: 280,
                            width: "100%",
                            maxHeight: 280,
                            height: "100%",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Loader;
