import { useMobile } from "@/utils/useMobile";
import DefaultViev from "./DefaultViev";
import MobileViev from "./MobileViev";

const LessonInfo = () => {
    const isMobile = useMobile(1024);

    if (!isMobile) return <DefaultViev />;
    if (isMobile) return <MobileViev />;
};

export default LessonInfo;
