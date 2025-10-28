import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect, useState, memo } from "react";

function TransformeKeepAliveTimeBase({ time }: { time: number }) {
    const { t } = useLanguageSync();

    const [raw, setRaw] = useState(time);

    useEffect(() => {
        if (time <= 0) return;

        setRaw(time);
        const interval = setInterval(() => {
            setRaw((r) => (r <= 60 ? 0 : r - 60));
        }, 30000);

        return () => clearInterval(interval);
    }, [time]);

    const displayTime =
        raw <= 0
            ? t("timer.expired")
            : (() => {
                  const hours = Math.floor(raw / 3600);
                  const minutes = Math.floor((raw % 3600) / 60);
                  if (hours > 24)
                      return `${Math.floor(hours / 24)}${t("timer.day")}`;
                  if (hours >= 1)
                      return minutes === 0
                          ? `${hours}${t("timer.hour")}`
                          : `${hours}${t("timer.hour")} ${minutes}${t(
                                "timer.minute"
                            )}`;
                  return `${minutes}${t("timer.minute")}`;
              })();

    return <span className="headlines-s fw500">{displayTime}</span>;
}

export const TransformeKeepAliveTime = memo(TransformeKeepAliveTimeBase);
