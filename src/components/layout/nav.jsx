'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { IsLoading } from '@/components/ui/isLoading';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/actions/signOut';
import { useShop } from '@/context/shopContext';
import { useProducts } from '@/context/productContext';

export function Nav() {
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const { _shop, setShop } = useShop();
    const { _products, setProducts } = useProducts();

    async function handleSignOut(e) {
        e.preventDefault();

        const userWantsToLeave = confirm('🤔 TEM CERTEZA QUE DESEJA SAIR?');

        if (userWantsToLeave) {
            setLoading(true);

            try {
                setShop(null);

                await signOut();

                setSuccessfulRequest(true);
                setFeedbackMessage('Bye Bye 👋');

                setTimeout(() => {
                    router.replace('/signin');
                }, 2000);
            } catch (err) {
                console.log(err);
                setFeedbackMessage(
                    'Ocorreu um erro ao tentar deslogar do ShopTurbo.'
                );

                setTimeout(() => {
                    setFeedbackMessage('');
                }, 3000);
            } finally {
                setLoading(false);
            }
        }
        return;
    }

    const [highlightedTab, setHighlightedTab] = useState(null);

    function handleClick(event) {
        setHighlightedTab(event.currentTarget.id);
    }

    // const buttons = [
    //   { id: "dashboardTab", label: "Botão 1" },
    //   { id: "btn2", label: "Botão 2" },
    //   { id: "btn3", label: "Botão 3" },
    // ];

    return (
        <nav className="border border-[--bg_4] min-w-fit p-2">
            <ul className="flex flex-col gap-4 p-2">
                <li
                    id="dashboardId"
                    onClick={handleClick}
                    className="flex rounded-md"
                >
                    <Link
                        href="/dashboard"
                        className={`min-w-full ${
                            highlightedTab === 'dashboardId'
                                ? 'bg-[--bg_5]'
                                : 'bg-[--bg_4]'
                        } py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer`}
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/products"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Produtos
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/commission"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Comissão
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/profit"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Lucro
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/taxes"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Impostos %
                    </Link>
                </li>

                <li className="flex rounded-md">
                    <Link
                        href="/integrate/shopee"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Conectar-se à Shopee
                    </Link>
                </li>

                <li className="flex rounded-md">
                    <Link
                        href="/support"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Suporte
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/my-account"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Minha conta
                    </Link>
                </li>

                <li className="flex rounded-md">
                    {!loading && (
                        <Link
                            onClick={handleSignOut}
                            href="/signout"
                            className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:border-red-600 hover:text-red-500 hover:cursor-pointer font-extrabold"
                        >
                            Sair
                        </Link>
                    )}

                    {loading && <IsLoading />}
                </li>
            </ul>

            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}
        </nav>
    );
}
