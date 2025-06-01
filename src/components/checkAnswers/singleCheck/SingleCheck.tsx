import { CorrectIco, IncorrextIco } from "@/assets/svg/icons";
import styles from "./singleCheck.module.css";
import { IAnswer, ICheckAnswers, ITaskData } from "@/models";
import { useLanguageSync } from "@/utils/useLanguage";

type propsTypes = {
    taskData: ITaskData;
    index: number;
    userAnswers: IAnswer[];
    results: ICheckAnswers[];
};

const SingleCheck: React.FC<propsTypes> = ({
    index,
    taskData,
    userAnswers,
    results,
}) => {
    const taskId = taskData.taskId;
    const taskResults = results?.find((task) => task.taskId === taskId);
    const userAnswer = userAnswers.filter(
        (answer) => answer.taskId === taskData.taskId
    )[0];
    const { t } = useLanguageSync();

    return (
        <div className={styles.container}>
            <h2 className="headlines-m" style={{ marginBottom: "1.5rem" }}>
                {`${t("exersice")} ${index}`}
            </h2>

            <div className={styles.content__container}>
                {taskData.questions &&
                    taskData.questions.map((question, index) => {
                        let questionAnswer;
                        if (userAnswer && "questions" in userAnswer) {
                            questionAnswer =
                                userAnswer.questions?.filter(
                                    (q) => q.questionId === question.questionId
                                )[0] !== null
                                    ? userAnswer.questions.filter(
                                          (q) =>
                                              q.questionId ===
                                              question.questionId
                                      )[0]
                                    : {
                                          questionId: question.questionId,
                                          userAnswer: "",
                                      };
                        } else
                            questionAnswer = {
                                questionId: question.questionId,
                                userAnswer: "",
                            };
                        const questionResults = taskResults?.questions.filter(
                            (q) => q.questionId === question.questionId
                        )[0];

                        return (
                            <div
                                key={taskId + index}
                                className={styles.content__item}
                            >
                                {questionResults && questionResults.result ? (
                                    <div className={styles.item__ico}>
                                        <CorrectIco />
                                        <span style={{ color: "#6ccf64" }}>
                                            {t("right")}
                                        </span>
                                    </div>
                                ) : (
                                    <div className={styles.item__ico}>
                                        <IncorrextIco />
                                        <span style={{ color: "#F60000" }}>
                                            {t("wrong")}
                                        </span>
                                    </div>
                                )}

                                <p className="body-m">
                                    {question.questionText}
                                </p>

                                {questionResults &&
                                questionAnswer.userAnswer ? (
                                    <div className={styles.content__item}>
                                        <p className="body-l">You choose:</p>

                                        <p
                                            className="body-l"
                                            style={
                                                taskResults.questions[index]
                                                    .result
                                                    ? { color: "#6ccf64" }
                                                    : { color: "#F60000" }
                                            }
                                        >
                                            {`"${questionAnswer.userAnswer}"`}
                                        </p>
                                    </div>
                                ) : (
                                    <p
                                        className="body-l"
                                        style={{ color: "#F60000" }}
                                    >
                                        {t("noAnswer")}
                                    </p>
                                )}

                                <p className="body-s">
                                    {questionResults?.questionDescription}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SingleCheck;
