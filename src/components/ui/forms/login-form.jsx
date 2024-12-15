"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/btn";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { FeedbackModal } from "../feedback-modal";
import { Loading } from "../loading";

export function LoginForm() {
    const [ feedbackMessage, setFeedbackMessage ] = useState("");
    const [ successfulRequest, setSuccessfulRequest ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            return setFeedbackMessage("");
        }, 3000);
    }, [ feedbackMessage ]);

    async function handleSubmit(e) {
        e.preventDefault();
        const userData = [];
        const formData = new FormData(document.querySelector("#login-form"));
        formData.forEach((data) => userData.push(data));
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userData }),
                }
            );
        
            if (!response.ok) {
                setLoading(false);
                setSuccessfulRequest(false);
                const responseData = await response.json();
                return setFeedbackMessage(responseData.error.issues[0].message);
            }

            setLoading(false);
            setSuccessfulRequest(true);
            setFeedbackMessage("Acesso autorizado!");
            setTimeout(() => {
                redirect("/dashboard");
                // window.location.href = "/dashboard";
            }, 3000);

        } catch (err) {
            setLoading(false);
            setSuccessfulRequest(false);
            return setFeedbackMessage(`Algo deu errado!\nTente novamente mais tarde...`);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center shadow-2xl border-[1px] border-[--bg_3] max-w-xs gap-8 py-16 px-8 rounded-2xl"
            id="login-form"
            onSubmit={handleSubmit}
            method="POST"
        >

            { feedbackMessage && <FeedbackModal request={successfulRequest} message={feedbackMessage} /> }

            <h2 className="text-2xl font-extrabold">Login</h2>

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
                    Criar conta
                </Button>
            )}

            {loading && (
                <Loading />
            )}
        </form>
    );
}
