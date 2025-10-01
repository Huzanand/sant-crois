"use client";
import style from "./page.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useOwnStore } from "@/store/storeProvider";

const schema = z.object({
    creatorEmail: z.string().email("Invalid email address"),
    challengerName: z.string().min(2, "Name must be at least 2 characters"),
});

type IFormData = z.infer<typeof schema>;

type CreateVRFormProps = {
    nopadding?: boolean;
};

const CreateVRForm = ({ nopadding }: CreateVRFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormData>({ resolver: zodResolver(schema) });

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
            // ✅ Send to API (or use server action if you want)
            const res = await fetch(
                // `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercises/${lesson?.id}/rooms`,
                `http://localhost:8080/exercises/${lesson?.id}/rooms`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            // Wait for backend confirmation
            await res;
            // await res.json;

            setRoomId(res as unknown as string);
            setRoomId("68dc1107a1271961250e6ace");

            // ✅ Move to step 2
            setStage("stage2");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={style.wrapper}
            style={{
                paddingTop: nopadding ? "" : "2rem",
                paddingBottom: nopadding ? "" : "2rem",
            }}
        >
            {stage === "stage1" && (
                <div className={style.container}>
                    <div className={style.header}>
                        <h1 className="headlines-m">
                            Создание виртуальной комнаты
                        </h1>
                        <h2 className="headlines-s">
                            Для создания комнаты заполните поля ниже.
                        </h2>
                        <h2 className="headlines-s">
                            После того, как комната будет создана, вы получите
                            ссылку для прохождения урока вашим учеником.
                        </h2>
                    </div>

                    <form
                        className={style.form}
                        onSubmit={handleSubmit(handleSubmitStage1)}
                    >
                        <div className={style.form_item}>
                            <p className={`body-m ${style.form_descr}`}>
                                Для получения результатов введите адрес вашей
                                электронной почты
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
                                Напишите имя ученика. Это поможет вам понять чей
                                результат вы получили
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
                            <button type="submit">
                                {loading
                                    ? "Creating a room..."
                                    : "Create VR room"}
                            </button>
                            {error && (
                                <p className={style.errorMessage}>{error}</p>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {stage === "stage2" && (
                <div className={style.container}>
                    <h1>VR room created sucsessfuly!</h1>
                    <h2>Now you can share this room to your student</h2>
                    <p>Copy the link and send it your student</p>

                    <div>
                        <div>
                            <input
                                type="text"
                                readOnly
                                value={`sant-crois.vercel.app/rooms/${roomId}`}
                            />
                        </div>
                        <div>$$</div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CreateVRForm;
