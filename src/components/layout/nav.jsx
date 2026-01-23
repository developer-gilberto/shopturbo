'use client';

import { signOut } from '@/api/users/signOut';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { IsLoading } from '@/components/ui/isLoading';
import { useProductPagination } from '@/context/productionPaginationContext';
import { useShop } from '@/context/shopContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { navTabItems } from './nav-tab-items';

export function Nav() {
    const [highlightedTab, setHighlightedTab] = useState('');
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const { shop, setShop } = useShop();
    const {
        pageSizeShopee,
        setHasPreviousPage,
        setHasNextPageShopturbo,
        setHasNextPageShopee,
        setCurrentPage,
    } = useProductPagination();

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
                    'Ocorreu um erro ao tentar deslogar do ShopTurbo.',
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

    function handleClickProductTab() {
        setHasNextPageShopturbo(true);
        setHasNextPageShopee(true);
        setCurrentPage(1);
        setHasPreviousPage(false);

        router.push(`/products?page=1&page_size=${pageSizeShopee}`);
    }

    return (
        <>
            {loading && <IsLoading width="w-96" />}
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <nav className="border border-[--bg_4] min-w-fit p-2">
                <ul className="flex flex-col gap-4 p-2">
                    {navTabItems.map((item) =>
                        item.isLink ? (
                            <li
                                key={item.id}
                                id={item.id}
                                onClick={(event) =>
                                    setHighlightedTab(event.currentTarget.id)
                                }
                                className="flex rounded-md"
                            >
                                <Link
                                    href={item.href}
                                    className={`min-w-full text-left py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--primary_color] hover:border-[--bg_3] hover:cursor-pointer ${
                                        highlightedTab === item.id
                                            ? 'bg-[--primary_color]'
                                            : 'bg-[--bg_4]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ) : (
                            <li
                                key={item.id}
                                id={item.id}
                                className="flex rounded-md"
                            >
                                <button
                                    onClick={handleClickProductTab}
                                    className={`min-w-full text-left py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--primary_color] hover:border-[--bg_3] hover:cursor-pointer ${
                                        highlightedTab === item.id
                                            ? 'bg-[--primary_color]'
                                            : 'bg-[--bg_4]'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ),
                    )}

                    <li className="flex rounded-md border-[--bg_3] mt-6">
                        <button
                            onClick={handleSignOut}
                            className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent text-left hover:border-red-600 hover:cursor-pointer hover:text-red-500 font-extrabold"
                        >
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}
