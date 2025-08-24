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
        const separatedContent = separatedText(content);

        type ParsedSegment =
            | { type: "text"; value: string | JSX.Element }
            | { type: "tooltip"; text: string; title: string; content: string };

        const parseBoldSegments = (text: string): ParsedSegment[] => {
            const segments: ParsedSegment[] = [];
            const boldRegex = /\*\*(.+?)\*\*/g;
            let lastIndex = 0;

            for (const match of text.matchAll(boldRegex)) {
                const matchStart = match.index!;
                const matchEnd = matchStart + match[0].length;

                if (matchStart > lastIndex) {
                    segments.push({
                        type: "text",
                        value: text.slice(lastIndex, matchStart),
                    });
                }

                segments.push({
                    type: "text",
                    value: <strong>{match[1]}</strong>,
                });

                lastIndex = matchEnd;
            }

            if (lastIndex < text.length) {
                segments.push({
                    type: "text",
                    value: text.slice(lastIndex),
                });
            }

            return segments;
        };

        const parseTooltipSegments = (input: string): ParsedSegment[] => {
            const result: ParsedSegment[] = [];

            const tooltipRegex = /<\[(.*?)\]\{(.*?)\}>/gs;
            let lastIndex = 0;

            for (const match of input.matchAll(tooltipRegex)) {
                const [fullMatch, tooltipText, attrString] = match;
                const matchStart = match.index!;
                const matchEnd = matchStart + fullMatch.length;

                if (matchStart > lastIndex) {
                    const textPart = input.slice(lastIndex, matchStart);
                    result.push(...parseBoldSegments(textPart));
                }

                const attrRegex = /(\w+)=("(?:[^"\\]|\\.)*?")/gs;
                const attributes: Record<string, string> = {};

                for (const attrMatch of attrString.matchAll(attrRegex)) {
                    const [, key, rawValue] = attrMatch;
                    attributes[key] = rawValue.slice(1, -1);
                }

                result.push({
                    type: "tooltip",
                    text: tooltipText,
                    title: attributes.title,
                    content: attributes.content,
                });

                lastIndex = matchEnd;
            }

            if (lastIndex < input.length) {
                const remainingText = input.slice(lastIndex);
                result.push(...parseBoldSegments(remainingText));
            }

            return result;
        };

        const parseTextWithTooltips = (text: string[][]) => {
            const result = [] as React.ReactNode[];

            text.forEach((p, pIndex) => {
                const newParagraf = [] as React.ReactNode[];

                p.forEach((s) => {
                    const segments = parseTooltipSegments(s);

                    const newS = segments.map((seg, idx) => {
                        if (seg.type === "text") {
                            return <span key={idx}>{seg.value}</span>;
                        } else {
                            return isMobile ? (
                                <ModalMob
                                    key={idx}
                                    title={seg.title}
                                    content={seg.content}
                                    underline
                                >
                                    <span className="body-m">{seg.text}</span>
                                </ModalMob>
                            ) : (
                                <Tooltip
                                    key={idx}
                                    title={seg.title}
                                    content={seg.content}
                                    underline
                                >
                                    <span className="body-m">{seg.text}</span>
                                    <span> </span>
                                </Tooltip>
                            );
                        }
                    });

                    newParagraf.push(newS);
                });

                result.push(<div key={`ttp-${pIndex}`}>{newParagraf}</div>);
            });

            return result;
        };

        return (
            <div>
                {!isTranscription && (
                    <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                        {`${t("exercise")} ${index}`}
                    </h2>
                )}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        lineHeight: "200%",
                    }}
                >
                    {parseTextWithTooltips(separatedContent)}
                </div>
            </div>
        );
    }
};

export default TextTask;
