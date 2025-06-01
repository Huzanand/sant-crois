import { DoneIco, InProgressIco, UnstartedIco } from '@/assets/svg/icons';
import styles from './progressBar.module.css';

type IProps = {
    data: string[]
}

const ProgressBar: React.FC<IProps> = ({ data }) => {

    const renderBar = (arr: string[]) => {
        const resultArr = [] as React.ReactNode[];
        arr.forEach((taskStatus, index) => {
            let ico: React.ReactNode;

            switch (taskStatus) {
                case '0':
                    ico = (<UnstartedIco />)
                    break;
                case '1':
                    ico = (<InProgressIco />)
                    break;
                case '2':
                    ico = (<DoneIco />)
                    break;

                default:
                    break;
            }

            resultArr.push(<div key={'progessbar-' + index} className={styles.item}>{ico}</div>)
        })

        return resultArr
    }

    return (
        <div className={styles.container}>
            <div className={styles.container__inner}>
                <div className={styles.line} />


                {renderBar(data)}


            </div>
        </div>
    )
}

export default ProgressBar