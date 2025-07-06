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
        // const content = `<[Die verschiedenen Bierdeckel habe ich von meinem Bruder bekommen]{title="Perfekt" content="Fast alle Sätze im Text stehen im Perfekt! Erinnere dich: haben sein + Partizip II."}>, ich sammle ja Bierdeckel. <[Der grüne Schal]{title="Adjektivdeklination im Nominativ" content="Artikel + Adjektiv + Nomen: Der grüne Schal (maskulin, Nominativ)."}> ist von meiner Oma. Sie hat immer Sorge, dass ich friere. Meine Eltern haben mir das tolle Handy hier geschenkt. Das alte Handy ist mir leider runtergefallen und kaputtgegangen. Und mit der großen Uhr vergesse ich nun hoffentlich nie wieder die Zeit. Meine Freundin hat sie mir gekauft, weil ich immer zu spät komme.`;

        const separatedContent = separatedText(content);

        type ParsedSegment =
            | { type: "text"; value: string }
            | { type: "tooltip"; text: string; title: string; content: string };

        function parseTooltipSegments(input: string): ParsedSegment[] {
            const result: ParsedSegment[] = [];

            const regex = /<\[(.*?)\]\{(.*?)\}>/gs;
            let lastIndex = 0;

            for (const match of input.matchAll(regex)) {
                const [fullMatch, tooltipText, attrString] = match;
                const matchStart = match.index!;
                const matchEnd = matchStart + fullMatch.length;

                if (matchStart > lastIndex) {
                    result.push({
                        type: "text",
                        value: input.slice(lastIndex, matchStart),
                    });
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
                result.push({
                    type: "text",
                    value: input.slice(lastIndex),
                });
            }

            return result;
        }

        const parseTextWithTooltips = (text: string[][]) => {
            const result = [] as React.ReactNode[];

            text.forEach((p, pIndex) => {
                const newParagraf = [] as React.ReactNode[];

                p.forEach((s) => {
                    const segments = parseTooltipSegments(s);

                    const newS = segments.map((seg, idx) => {
                        if (seg.type === "text") {
                            return <span key={idx}>{seg.value + " "}</span>;
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
                        {`${t("exersice")} ${index}`}
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
