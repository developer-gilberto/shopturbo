"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/btn";

export default function IntegrateApiShopee() {
    const [ loading, setLoading ] = useState(false);

    async function handleIntegrateApiShopee() {
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/shopee/generate-auth-url`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            setLoading(false);
            console.error("Ocorreu um erro na solicitação da url de autorização:", response.statusText);
            return alert("Ocorreu um erro na solicitação da url de autorização!");
        }

        const authorizationUrl = await response.json();

        if (authorizationUrl.validToken) {
            setLoading(false);
            return alert("ShopTurbo já está conectado com a API Shopee!");
        }

        redirect(`${authorizationUrl.url}`);
    }

    return (
        <section className="w-full h-dvh flex justify-evenly items-center gap-10">
            <div className="flex flex-col justify-between items-center gap-6 w-[768px]">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xl">
                        Clique no botão abaixo para conceder a autorização para o <span className="text-primary_color">ShopTurbo</span> se integrar com a <span className="font-bold">API da Shopee!</span>
                    </p>
                </div>
                <div className="mt-4">
                    {!loading && (
                        <Button onClick={handleIntegrateApiShopee} >
                            Conectar-se à Shopee
                        </Button>
                    )}

                    {loading && (
                        <Loading />
                    )}
                </div>
            </div>
        </section>
    );
}
