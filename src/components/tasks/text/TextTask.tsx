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

    if (content) {
        const safeContent = content.replace(/\\"/g, '"').replace(/\\n/g, "\n");
        const separatedContent = separatedText(safeContent);

        const parseTextWithTooltips = (text: string[][]) => {
            const parsedText: React.JSX.Element[] = [];
            const boldRegex = /\*\*(.*?)\*\*/g;

            const insertBoldAndTooltips = (raw: string, keyPrefix: string) => {
                const tooltipRegex =
                    /<\[(.+?)\]\{title="(.+?)"\s+content="(.+?)"\}>/g;

                const parts: React.JSX.Element[] = [];
                let lastIndex = 0;
                let match;
                let i = 0;

                while ((match = tooltipRegex.exec(raw)) !== null) {
                    const before = raw.slice(lastIndex, match.index);
                    const phrase = match[1];
                    const title = match[2];
                    const content = match[3];

                    if (before) {
                        parts.push(
                            ...insertBold(before, `${keyPrefix}-pre-${i}`)
                        );
                    }

                    const tooltipElement = isMobile ? (
                        <ModalMob
                            key={`${keyPrefix}-tooltip-${i}`}
                            title={title}
                            content={<p className="body-s">{content}</p>}
                            underline
                        >
                            <span className="body-m">{phrase}</span>
                        </ModalMob>
                    ) : (
                        <Tooltip
                            key={`${keyPrefix}-tooltip-${i}`}
                            title={title}
                            content={content}
                            underline
                        >
                            <span className="body-m">{phrase}</span>
                        </Tooltip>
                    );
                    parts.push(tooltipElement);

                    lastIndex = tooltipRegex.lastIndex;
                    i++;
                }

                if (lastIndex < raw.length) {
                    parts.push(
                        ...insertBold(raw.slice(lastIndex), `${keyPrefix}-post`)
                    );
                }

                return parts;
            };

            const insertBold = (
                text: string,
                keyPrefix: string
            ): React.JSX.Element[] => {
                const result: React.JSX.Element[] = [];
                let match;
                let currentIndex = 0;
                let i = 0;

                while ((match = boldRegex.exec(text)) !== null) {
                    if (currentIndex < match.index) {
                        result.push(
                            <span key={`${keyPrefix}-plain-${i}`}>
                                {text.slice(currentIndex, match.index)}
                            </span>
                        );
                    }
                    result.push(
                        <span
                            key={`${keyPrefix}-bold-${i}`}
                            style={{ fontWeight: "bold" }}
                        >
                            {match[1]}
                        </span>
                    );
                    currentIndex = boldRegex.lastIndex;
                    i++;
                }

                if (currentIndex < text.length) {
                    result.push(
                        <span key={`${keyPrefix}-plain-last`}>
                            {text.slice(currentIndex)}
                        </span>
                    );
                }

                return result;
            };

            text.map((paragraphSentences, paragraphIndex) => {
                const paragraphElements: React.JSX.Element[] = [];

                paragraphSentences.map((sentence, sentenceIndex) => {
                    paragraphElements.push(
                        <React.Fragment
                            key={`p-${paragraphIndex}-s-${sentenceIndex}`}
                        >
                            {insertBoldAndTooltips(
                                sentence,
                                `p-${paragraphIndex}-s-${sentenceIndex}`
                            )}{" "}
                        </React.Fragment>
                    );
                });

                parsedText.push(
                    <div
                        key={`p-${paragraphIndex}`}
                        style={{ lineHeight: "150%" }}
                    >
                        {paragraphElements}
                    </div>
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
    }
};

export default TextTask;
