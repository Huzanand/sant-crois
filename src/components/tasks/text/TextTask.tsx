import React from "react";
import Tooltip from "../../tooltip/Tooltip";
import { useMobile } from "@/utils/useMobile";
import ModalMob from "@/components/modalMod/ModalMod";
import { useLanguageSync } from "@/utils/useLanguage";
import separatedText from "@/utils/separatedText";

const TextTask: React.FC<{
    content: string;
    isTranscription?: boolean;
    index?: number;
}> = ({ content, isTranscription, index }) => {
    const isMobile = useMobile(1024);

    const { t } = useLanguageSync();

    const separatedContent = separatedText(content);

    const parseTextWithTooltips = (text: string[][]) => {
        const tooltipRegex = /<\[(.*?)\]\{title="(.*?)"\s*content="(.*?)"\}>/g;
        const boldRegex = /\*\*(.*?)\*\*/g;

        const parsedText: React.JSX.Element[] = [];

        text.map((paragrafs, paragrafIndex) => {
            const lineParsed: React.JSX.Element[] = [];

            let lastIndex = 0;

            const insertBoldText = (text: string) => {
                let match;
                let currentIndex = 0;
                while ((match = boldRegex.exec(text)) !== null) {
                    if (currentIndex < match.index) {
                        lineParsed.push(
                            <span key={lineParsed.length}>
                                {`${text.slice(currentIndex, match.index)} `}
                            </span>
                        );
                    }
                    lineParsed.push(
                        <span
                            key={lineParsed.length}
                            style={{ fontWeight: "bold" }}
                        >
                            {`${match[1]} `}
                        </span>
                    );
                    currentIndex = boldRegex.lastIndex;
                }

                if (currentIndex < text.length) {
                    lineParsed.push(
                        <span className="body-m" key={lineParsed.length}>
                            {`${text.slice(currentIndex)} `}
                        </span>
                    );
                }
            };

            paragrafs.map((sentence: string) => {
                let match;
                while ((match = tooltipRegex.exec(sentence)) !== null) {
                    if (lastIndex < match.index) {
                        insertBoldText(sentence.slice(lastIndex, match.index));
                    }

                    const phrase = match[1];
                    const title = match[2];
                    const content = match[3];

                    if (isMobile) {
                        lineParsed.push(
                            <ModalMob
                                key={lineParsed.length}
                                title={title}
                                content={<p className="body-s">{content}</p>}
                                underline
                            >
                                <span className="body-m">{phrase}</span>
                            </ModalMob>
                        );
                    } else {
                        lineParsed.push(
                            <Tooltip
                                key={lineParsed.length}
                                title={title}
                                content={content}
                                underline
                            >
                                <span className="body-m">{phrase}</span>
                            </Tooltip>
                        );
                    }

                    lastIndex = tooltipRegex.lastIndex;
                }

                if (lastIndex < sentence.length) {
                    insertBoldText(sentence.slice(lastIndex));
                }
            });

            parsedText.push(
                <React.Fragment key={paragrafIndex}>
                    <div style={{ lineHeight: "150%" }}>{lineParsed}</div>
                </React.Fragment>
            );
        });

        return parsedText;
    };

    return (
        <div>
            {!isTranscription && (
                <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                    {`${t("exersice")} ${index}`}
                </h2>
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {parseTextWithTooltips(separatedContent)}
            </div>
        </div>
    );
};

export default TextTask;
