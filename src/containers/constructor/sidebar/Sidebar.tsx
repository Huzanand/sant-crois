import { ArrowDownIco } from "@/assets/svg/icons"
import styles from "./sidebar.module.css"
import Logo from "@/components/logo/Logo"
import Divider from "@/components/divider/Divider"
import NewExerciseDropdown from "@/components/constructor/newTaskDropdown/NewExerciseDropdown"
import { ButtonPrimary } from "@/components/common/buttons/ButtonPrimary"
import { ButtonSecondary } from "@/components/common/buttons/ButtonSecondary"
import TaskList from "../taskList/TaskList"
import { boolean } from "zod"

const Sidebar = ({ onPreviewToggle, isPreview }: {onPreviewToggle: () => void, isPreview: boolean }) => (
    <div className={styles.container}>
        <Logo />
        {/* <div className={styles.btnBack_container}>
            <button className={`buttons-l b-500`}>All my lessons
                <div style={{ display: "inline-flex", alignItems: 'center', justifyContent: 'center', transform: 'rotate(270deg)' }}>
                    <ArrowDownIco />
                </div>
            </button>
        </div> */}

        <Divider />

        <TaskList />

        <NewExerciseDropdown />

        <Divider margin="2rem 0" />

        <div className={styles.btn_container}>
            <ButtonSecondary onClick={onPreviewToggle}>
                <span className="buttons-l blue-b500">
                    {isPreview ? "Back to Edit" : "Preview"}
                </span>
            </ButtonSecondary>
            {/* <ButtonSecondary ><span className="buttons-l blue-b500">Save draft</span></ButtonSecondary> */}
            <ButtonPrimary><span className='buttons-l' style={{ color: '#fff' }}>Publish lesson</span></ButtonPrimary>
        </div>

    </div>
)


export default Sidebar