"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/btn";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { FeedbackModal } from "../feedback-modal";
import { Loading } from "../loading";

export function LoginForm() {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackMessage("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [feedbackMessage]);

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const userData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/signin`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                    credentials: "include",
                },
            );

            if (!response.ok) {
                setSuccessfulRequest(false);

                return setFeedbackMessage(
                    response.status === 401 || response.status === 400
                        ? "Email ou senha incorretos."
                        : "Erro ao tentar fazer login.",
                );
            }

            setSuccessfulRequest(true);
            setFeedbackMessage("Login bem sucedido!");

            setTimeout(() => {
                redirect("/dashboard");
            }, 3000);
        } catch (err) {
            setSuccessfulRequest(false);
            return setFeedbackMessage(
                `Erro ao fazer login!\nTente novamente mais tarde...`,
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center shadow-2xl border-[1px] border-[--bg_3] max-w-xs gap-8 py-16 px-8 rounded-2xl"
            id="login-form"
            onSubmit={handleSubmit}
            method="POST"
        >
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <h2 className="text-3xl font-extrabold">Login</h2>

            <Input type="email" name="email" placeholder="Email" />

            <Input type="password" name="password" placeholder="Senha" />

            <div className="flex flex-col justify-center items-start gap-0">
                Não tem uma conta ShopTurbo?
                <Link
                    className="text-primary_color hover:cursor-pointer hover:underline hover:text-secondary_color"
                    href="/signup"
                >
                    &gt; Criar conta.
                </Link>
            </div>

            {!loading && (
                <Button type="submit" width="w-full">
                    Entrar
                </Button>
            )}

            {loading && <Loading />}
        </form>
    );
}
