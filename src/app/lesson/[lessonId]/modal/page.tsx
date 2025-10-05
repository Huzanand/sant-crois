"use client";
import style from "./page.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useOwnStore } from "@/store/storeProvider";
import { CopyIco } from "@/assets/svg/icons";
import { useRouter } from "next/navigation";

const schema = z.object({
    creatorEmail: z.string().email("Invalid email address"),
    challengerName: z.string().min(2, "Name must be at least 2 characters"),
});

type IFormData = z.infer<typeof schema>;

const CreateVRForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormData>({ resolver: zodResolver(schema) });

    const router = useRouter();

    const { lesson } = useOwnStore((state) => state);

    const [stage, setStage] = useState<"stage1" | "stage2" | "stage3">(
        "stage1"
    );

    const [roomId, setRoomId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<"string" | null>(null);

    const handleSubmitStage1 = async (data: IFormData) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercises/${lesson?.id}/rooms`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            const responce = await res.json();

            setRoomId(responce.roomId);
            setStage("stage2");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(
            `sant-crois.vercel.app/rooms/${roomId}`
        );
    };

    return (
        <div className={style.wrapper}>
            <div className={style.container}>
                {stage === "stage1" && (
                    <>
                        <div className={style.header}>
                            <h1 className="headlines-m">
                                Создание виртуальной комнаты
                            </h1>
                            <h2 className="headlines-s">
                                Для создания комнаты заполните поля ниже.
                            </h2>
                            <h2 className="headlines-s">
                                После того, как комната будет создана, вы
                                получите ссылку для прохождения урока вашим
                                учеником.
                            </h2>
                        </div>

                        <form
                            className={style.form}
                            onSubmit={handleSubmit(handleSubmitStage1)}
                        >
                            <div className={style.form_item}>
                                <p className={`body-m ${style.form_descr}`}>
                                    Для получения результатов введите адрес
                                    вашей электронной почты
                                </p>
                                <label>Ваш электронный адресс</label>
                                <input
                                    type="text"
                                    placeholder="name@mail.com"
                                    {...register("creatorEmail")}
                                />
                                {errors.creatorEmail && (
                                    <p className={style.errorMessage}>
                                        {errors.creatorEmail.message}
                                    </p>
                                )}
                            </div>

                            <div className={style.form_item}>
                                <p className={`body-m ${style.form_descr}`}>
                                    Напишите имя ученика. Это поможет вам понять
                                    чей результат вы получили
                                </p>
                                <label className={style.nameLabel}>
                                    Ученик увидит имя, которое вы указали
                                </label>
                                <input
                                    type="text"
                                    placeholder="student`s name"
                                    {...register("challengerName")}
                                />
                                {errors.challengerName && (
                                    <p className={style.errorMessage}>
                                        {errors.challengerName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <button className={style.btn} type="submit">
                                    {loading
                                        ? "Creating a room..."
                                        : "Create VR room"}
                                </button>
                                {error && (
                                    <p className={style.errorMessage}>
                                        {error}
                                    </p>
                                )}
                            </div>
                        </form>
                    </>
                )}

                {stage === "stage2" && (
                    <>
                        <h1 className="headlines-m">
                            Комната успешно создана!
                        </h1>
                        <h2 className="headlines-s">
                            Теперь вы можете поделиться уроком
                        </h2>
                        <p className="body-m">
                            Скопируйте ссылку и отправте ученику
                        </p>

                        <div>
                            <div className={style.input_container}>
                                <input
                                    className={style.input}
                                    type="text"
                                    readOnly
                                    value={`sant-crois.vercel.app/rooms/${roomId}`}
                                />
                                <button
                                    onClick={handleCopy}
                                    className={style.input_copyBtn}
                                >
                                    <CopyIco className={style.copyIco} />
                                </button>
                            </div>

                            <p className="headlines-s red-r500">
                                Комната будет доступна в течении 7 дней
                            </p>
                        </div>

                        <button
                            onClick={() => setStage("stage3")}
                            className={style.btn}
                        >
                            Ready
                        </button>
                    </>
                )}

                {stage === "stage3" && (
                    <>
                        <h1 className="headlines-m">Готово</h1>
                        <p className="body-l">
                            Вы получите результаты на указанную почту,когда
                            студент закончит выполнение урока
                        </p>

                        <button
                            onClick={() => router.back()}
                            className={style.btn}
                        >
                            Закрыть
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
export default CreateVRForm;
