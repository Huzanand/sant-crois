import { useEffect, useState, memo } from "react";

function TransformeKeepAliveTimeBase({ time }: { time: number }) {
    const [displayTime, setDisplayTime] = useState("");

    const parseTime = (t: number) => {
        const hours = Math.floor(t / 3600);
        const minutes = Math.floor((t % 3600) / 60);
        return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        let rawTime = time;
        setDisplayTime(parseTime(rawTime));

        const interval = setInterval(() => {
            rawTime -= 60;
            if (rawTime <= 0) {
                clearInterval(interval);
                setDisplayTime("");
                return;
            }
            setDisplayTime(parseTime(rawTime));
        }, 30000);

        return () => clearInterval(interval);
    }, [time]);

    return <span>{displayTime}</span>;
}

export const TransformeKeepAliveTime = memo(TransformeKeepAliveTimeBase);
