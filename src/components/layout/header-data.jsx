'use client';

import { useShop } from '@/context/shopContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

export function HeaderData() {
    const { shop } = useShop();

    return (
        <>
            {shop && (
                <div className="flex justify-center items-center gap-4 text-xl">
                    Bem vindo ao ShopTurbo 🚀{' '}
                    <span className="text-[--primary_color] text-2xl">
                        {shop.shop_name}
                    </span>
                </div>
            )}

            {shop && (
                <Link
                    href="/my-account"
                    className="hover:border-[--bg_3] hover:cursor-pointer rounded-full"
                >
                    {shop && shop.profile ? (
                        <Image
                            src={shop.profile.shop_logo}
                            alt="Loja"
                            width={48}
                            height={48}
                            quality={80}
                            className="rounded-full"
                        />
                    ) : (
                        <FaUser className="bg-[--bg_4] w-12 h-12 rounded-full" />
                    )}
                </Link>
            )}
        </>
    );
}
