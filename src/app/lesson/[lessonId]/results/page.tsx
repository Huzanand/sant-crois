"use client";

import styles from "./page.module.css";
import { useOwnStore } from "@/store/storeProvider";
import { useParams, useRouter } from "next/navigation";
import Recomendations from "@/components/recomendations/Recomandations";
import ResultsHeader from "@/components/settingsSelect/resultsHeader/ResultsHeader";
import { Fragment, useEffect } from "react";
import { interceptorsStore } from "@/store/interceptorsStore";
import MultipleCheck from "@/components/checkAnswers/multipleCheck/MultipleCheck";
import SingleCheck from "@/components/checkAnswers/singleCheck/SingleCheck";
import { ILesson } from "@/models";
import Loader from "@/components/loader/Loader";
import { useLanguageSync } from "@/utils/useLanguage";
import Error404 from "@/components/error404/Error404";

const Results = () => {
  const {
    lesson,
    relatedContents,
    clearRecomendations,
    userAnswers,
    sendUserAnswers,
    clearUserAnswers,
    results,
    clearResults,
  } = useOwnStore((store) => store);

  const { loading, error } = interceptorsStore((state) => state);
  const router = useRouter();
  const { lessonId } = useParams();
  const { t } = useLanguageSync();

  useEffect(() => {
    if (lessonId) {
      sendUserAnswers(lessonId as string);
    }
  }, [lessonId, sendUserAnswers]);

  const renderTask = (task: ILesson["tasks"][number], index: number) => {
    switch (task.taskType) {
      case "MEDIA_TASK":
        switch (task.content?.contentType) {
          case "CHOOSE_TEMPLATE":
            return (
              <MultipleCheck
                taskData={task}
                index={index + 1}
                userAnswers={userAnswers}
                results={results}
                withOptions
              />
            );

          case "FILL_TEMPLATE":
            return (
              <MultipleCheck
                taskData={task}
                index={index + 1}
                userAnswers={userAnswers}
                results={results}
              />
            );

          default:
            return null;
        }

      case "CHOOSE_ANSWER":
        return (
          <SingleCheck
            type="CHOOSE_ANSWER"
            taskData={task}
            index={index + 1}
            userAnswers={userAnswers}
            results={results}
          />
        );

      case "TRUE_FALSE":
        return (
          <SingleCheck
            type="TRUE_FALSE"
            taskData={task}
            index={index + 1}
            userAnswers={userAnswers}
            results={results}
          />
        );

      default:
        return null;
    }
  };

  const renderTasks = (lesson: ILesson) => {
    return (
      <div>
        {lesson.tasks.map((task, index) => {
          const renderedTask = renderTask(task, index);

          if (!renderedTask) {
            return null;
          }

          return (
            <Fragment key={task.taskId}>
              {renderedTask}

              <div className={styles.divider} />
            </Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {!lesson ? (
        <Error404 page="check" />
      ) : (
        <>
          {loading && !error && <Loader />}

          {!loading && !error && (
            <div>
              <ResultsHeader />

              <div className={styles.container}>
                {renderTasks(lesson)}

                {relatedContents.length > 0 && (
                  <Recomendations content={relatedContents as []} />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "3rem",
                  }}
                >
                  <button
                    className={styles.btnHome}
                    onClick={() => {
                      clearRecomendations();
                      clearUserAnswers();
                      clearResults();
                      setTimeout(() => router.replace(`/`), 0);
                    }}
                  >
                    {t("btnBack")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Results;
