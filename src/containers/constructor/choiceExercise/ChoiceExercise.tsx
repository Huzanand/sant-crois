"use client"
import ChooseQuestion from "@/components/constructor/choiceQuestion/ChoiceQuestion";
import styles from "./choiceExercise.module.css"
import { useOwnStore } from "@/store/storeProvider";
import { ButtonSecondary } from "@/components/common/buttons/ButtonSecondary";
import { IDraftQuestion } from "@/models";
import { AddBtnIco } from "@/assets/svg/icons";
import TrueFalseQuestion from "@/components/constructor/trueFalseQuestion/TrueFalseQuestion";

interface props {
    type: 'CHOOSE_ANSWER' | 'TRUE_FALSE';
    id?: string
}

const ChoiceExercise = ({ type, id: taskId }: props) => {


    const draft = useOwnStore(state => state.draft)
    const { updateConstructorTask } = useOwnStore(state => state)
    const task = draft.tasks.filter(t => t.taskId === taskId)[0];

    const onUpdateQuestion = (questionId: string, patch: Partial<IDraftQuestion>) => {
        if (!task || !taskId) return;
        const updatedQuestions = task.questions?.map(q =>
            q.questionId === questionId ? { ...q, ...patch } : q
        );
        updateConstructorTask(taskId, { questions: updatedQuestions });
    };

    const onDeleteQuestion = (questionId: string) => {
        if (!task || !taskId) return;
        const updatedQuestions = task.questions?.filter(q => q.questionId !== questionId);
        updateConstructorTask(taskId, { questions: updatedQuestions });
    };

    const onMoveQuestionUp = (questionId: string) => {
        if (!task || !taskId || !task.questions) return;
        const index = task.questions.findIndex(q => q.questionId === questionId);
        if (index <= 0) return;

        const updatedQuestions = [...task.questions];
        [updatedQuestions[index - 1], updatedQuestions[index]] = [updatedQuestions[index], updatedQuestions[index - 1]];

        updateConstructorTask(taskId, { questions: updatedQuestions });
    };

    const onMoveQuestionDown = (questionId: string) => {
        if (!task || !taskId || !task.questions) return;
        const index = task.questions.findIndex(q => q.questionId === questionId);
        if (index === -1 || index === task.questions.length - 1) return;

        const updatedQuestions = [...task.questions];
        [updatedQuestions[index + 1], updatedQuestions[index]] = [updatedQuestions[index], updatedQuestions[index + 1]];

        updateConstructorTask(taskId, { questions: updatedQuestions });
    };


    const handleNewQuestion = () => {
        if (!task || !taskId) return;

        const newQuestion: IDraftQuestion = {
            questionId: crypto.randomUUID(),
            questionText: '',
            options: [],
            questionDescription: '',
            rightAnswers: []
        }

        const updatedQuestions = [...(task.questions || []), newQuestion];

        updateConstructorTask(taskId, {
            questions: updatedQuestions
        });
    };

    const renderQuestions = (type: 'CHOOSE_ANSWER' | 'TRUE_FALSE') => {
        if (type === 'CHOOSE_ANSWER') {
            return task?.questions?.map((q, index) => (
                <ChooseQuestion
                    key={q.questionId}
                    question={q}
                    index={index}
                    onUpdate={onUpdateQuestion}
                    onDelete={onDeleteQuestion}
                    onMoveUp={onMoveQuestionUp}
                    onMoveDown={onMoveQuestionDown}
                />
            ))
        } else return task?.questions?.map((q, index) => (
            <TrueFalseQuestion
                key={q.questionId}
                question={q}
                index={index}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                onMoveUp={onMoveQuestionUp}
                onMoveDown={onMoveQuestionDown}
            />
        ))
    }

    return (
        <div className={styles.question_container}>
            {renderQuestions(type)}

            <div className={styles.newQuestBtn_container}>
                <div className={styles.newQuestBtn}>
                    <ButtonSecondary onClick={handleNewQuestion}><AddBtnIco /><span>New question</span></ButtonSecondary>
                </div>
            </div>
        </div>
    )
}

export default ChoiceExercise;