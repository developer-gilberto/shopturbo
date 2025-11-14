'use client';

import { useShop } from '@/context/shopContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IsLoading } from '../ui/isLoading';
import { Logo } from '../ui/logo';

export function Header() {
  const { shop, setShop } = useShop();
  const [loading, setLoading] = useState(false);

  return (
    <header className="flex justify-between items-center gap-2 p-2 border-b-[1px] border-[--bg_4]">
      <Link href="/dashboard" className="flex items-center gap-1">
        <Logo width={48} height={48} />
        <strong className="text-primary_color text-xl font-bold">
          ShopTurbo
        </strong>
        &reg;
      </Link>

      {loading && <IsLoading width="w-[320px]" />}

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
          {shop && shop.shop_logo ? (
            <Image
              src={shop.shop_logo}
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
    </header>
  );
}
