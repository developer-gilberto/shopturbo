"use client";

import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";
import { useShop } from "@/context/shopContext";

export default function Dashboard() {
    const { shop } = useShop();

    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <div>
                    <Main>Dashboard</Main>
                    <div className="m-4">
                        {shop ? (
                            <h1 className="text-[--primary_color] text-2xl">
                                Bem vindo ao ShopTurbo {shop.shop_name}
                            </h1>
                        ) : (
                            <p>
                                Você ainda não conectou o ShopTurbo à Shopee.
                                Quando você autorizar nosso sistema, os dados da
                                sua loja aparecerão aqui.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
