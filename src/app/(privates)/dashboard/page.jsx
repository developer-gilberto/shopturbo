'use client';

import { fetchShopProfile } from '@/app/actions/fetchShopProfile';
import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { useShop } from '@/context/shopContext';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/ui/loading';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const { shop, setShop } = useShop();

    useEffect(() => {
        async function fetchShop() {
            try {
                setLoading(true);

                const response = await fetchShopProfile();

                if (response.status !== 200) return;

                const shopData = response.data;
                setShop(shopData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchShop();
    }, []);

    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <div>
                    <Main>Dashboard</Main>
                    <div className="m-4">
                        {loading && <Loading />}

                        {shop ? (
                            <div className="text-xl">
                                Bem vindo ao ShopTurbo{' '}
                                <span className="text-[--primary_color] text-2xl">
                                    {shop.shop_name}
                                </span>
                            </div>
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
