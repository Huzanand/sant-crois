import styled from "./card.module.css";
import Rating from "../rating/Rating";
import { ICard } from "@/models";
// import Tooltip from "../tooltip/Tooltip";
import { EyeIco, IIco, StarIco } from "@/assets/svg/icons";
import { useState } from "react";
import { makeFirstLetterUppercase } from "@/utils/makeFirstLetterUppercase";
import { useLanguageSync } from "@/utils/useLanguage";

const Card: React.FC<ICard> = ({
    header,
    cover,
    primaryTopics,
    secondaryTopics,
    learningLanguage,
    languageLevel,
    acceptance,
    rating,
    views,
    customStyles,
    recomendation,
    ageGroup,
}) => {
    const [showTooltip, setShowInfo] = useState<boolean>(false);
    const { t } = useLanguageSync();

    return (
        <div className={styled.container} style={customStyles}>
            {/* Additional information driver */}
            <div
                className={
                    showTooltip
                        ? `${styled.additionalInfo__container} ${styled.showTooltip}`
                        : styled.additionalInfo__container
                }
                onMouseLeave={() => setShowInfo(false)}
            >
                <div className={styled.additionalInfo}>
                    {header ? (
                        <h4
                            className="headlines-m"
                            style={{
                                paddingBottom: "16px",
                            }}
                        >
                            {makeFirstLetterUppercase(header)}
                        </h4>
                    ) : undefined}

                    <div style={{ paddingBottom: "16px" }}>
                        {primaryTopics ? (
                            <div>
                                <p
                                    className="headlines-s"
                                    style={{ paddingBottom: "8px" }}
                                >
                                    {`${t("main themes")}:`}
                                </p>
                                <div>
                                    {primaryTopics.map((topic, index) => {
                                        if (
                                            index + 1 ===
                                            primaryTopics.length
                                        ) {
                                            return (
                                                <p
                                                    className="body-s"
                                                    key={
                                                        "primaryTopic " + index
                                                    }
                                                >
                                                    {`${makeFirstLetterUppercase(
                                                        topic
                                                    )}.`}
                                                </p>
                                            );
                                        }
                                        return (
                                            <p
                                                className="body-s"
                                                key={"primaryTopic " + index}
                                            >{`${makeFirstLetterUppercase(
                                                topic
                                            )}, `}</p>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div style={{ paddingBottom: "16px" }}>
                        {secondaryTopics ? (
                            <div>
                                <p
                                    className="headlines-s"
                                    style={{ paddingBottom: "8px" }}
                                >
                                    {`${t("secondary themes")}:`}
                                </p>
                                <div>
                                    {secondaryTopics.map((topic, index) => {
                                        if (
                                            index + 1 ===
                                            primaryTopics.length
                                        ) {
                                            return (
                                                <p
                                                    className="body-s"
                                                    key={
                                                        "secondaryTopic " +
                                                        index
                                                    }
                                                >
                                                    {`${makeFirstLetterUppercase(
                                                        topic
                                                    )}.`}
                                                </p>
                                            );
                                        }
                                        return (
                                            <p
                                                className="body-s"
                                                key={"secondaryTopic " + index}
                                            >{`${makeFirstLetterUppercase(
                                                topic
                                            )}, `}</p>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div>
                        {ageGroup ? (
                            <div>
                                <p
                                    className="headlines-s"
                                    style={{ paddingBottom: "8px" }}
                                >
                                    {`${t("age group")}:`}
                                </p>
                                <div>
                                    <p className="body-s" key={"age group"}>
                                        {`${makeFirstLetterUppercase(
                                            ageGroup.toLowerCase()
                                        )}.`}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* main card viev */}
            <div className={styled.card}>
                {/* photo */}
                <div className={styled.card__image_container}>
                    <div className={styled.card__image_overlay}></div>
                    {/*eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={cover}
                        alt="photo of lesson"
                        className={styled.card__image}
                    />
                    {header ? (
                        <p className={`${styled.card__image_text} headlines-s`}>
                            {makeFirstLetterUppercase(header)}
                        </p>
                    ) : null}
                </div>

                {/* content */}
                <div className={styled.card__content}>
                    {/* I icon */}

                    {!recomendation && (
                        <div
                            className={styled.infoBtn}
                            style={
                                recomendation ? { right: "1rem" } : undefined
                            }
                            onMouseEnter={() => setShowInfo(true)}
                        >
                            <div>
                                <IIco />
                            </div>
                        </div>
                    )}

                    {/* primary topic */}
                    <p className={`body-l ${styled.primaryTopic}`}>
                        {makeFirstLetterUppercase(primaryTopics[0])}
                    </p>
                    <div>
                        {/* secondary topic */}
                        {secondaryTopics ? (
                            <p className={`body-s ${styled.secondaryTopic}`}>
                                {makeFirstLetterUppercase(secondaryTopics[0])}
                            </p>
                        ) : null}

                        {!recomendation && (
                            <div className={styled.language}>
                                <span className="body-l">
                                    {learningLanguage}
                                </span>
                                <div className="divider__dot" />
                                <span
                                    className={`body-l ${styled.scrollable_text}`}
                                >
                                    {t(
                                        `selectedLanguageLevel.${languageLevel}`
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* feedback */}
                    <div
                        className={styled.feedback}
                        style={
                            recomendation
                                ? {
                                      width: "100%",
                                      justifyContent: "space-between",
                                      marginTop: recomendation
                                          ? "0.5rem"
                                          : undefined,
                                  }
                                : undefined
                        }
                    >
                        {!recomendation && (
                            <div className={styled.difficulty}>
                                <p className="body-s">{t("complexity")}</p>
                                <Rating rating={acceptance ? acceptance : 0} />
                            </div>
                        )}

                        <div className={styled.flex}>
                            <p className="body-l">{rating ? rating : 0}</p>
                            <StarIco />
                        </div>

                        {/* <Tooltip
                            content={`${countOfSuccess} успешных выполнений`}
                            style={{
                                width: "217px",
                                background: "#6554C0",
                                color: "#fff",
                                left: "-144%",
                                padding: "0.5rem 1rem",
                            }}
                        > */}
                        <div className={styled.flex}>
                            <p className="body-s">{views ? views : 0}</p>
                            <EyeIco />
                        </div>
                        {/* </Tooltip> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
