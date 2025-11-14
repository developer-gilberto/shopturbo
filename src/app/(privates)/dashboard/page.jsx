'use client';

import { fetchShopProfile } from '@/api/shop/fetchShopProfile';
import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { IsLoading } from '@/components/ui/isLoading';
import { useShop } from '@/context/shopContext';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [expireIn, setExpireIn] = useState('');
  const { shop, setShop } = useShop();

  useEffect(() => {
    async function fetchShop() {
      if (shop) {
        const expireTime = new Date(Number(shop.expire_time) * 1000);
        setExpireIn(expireTime.toLocaleDateString('pt-BR'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetchShopProfile();

        if (response.status !== 200) {
          console.log(response);
          return;
        }

        const shopData = response.data;

        setShop(shopData);

        const expireTime = new Date(Number(shopData.expire_time) * 1000);

        setExpireIn(expireTime.toLocaleDateString('pt-BR'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, []);

  if (!shop) {
    return (
      <section className=" w-full min-h-screen flex">
        <Nav />
        <Main>
          <p className="text-gray-400 text-center">
            Você ainda não conectou o ShopTurbo à Shopee. Quando você autorizar
            nosso sistema, os dados da sua loja aparecerão aqui.
          </p>
        </Main>
      </section>
    );
  }

  return (
    <section className=" w-full min-h-screen flex">
      <Nav />
      <Main>
        <div>
          {loading && <IsLoading width="w-[340px]" />}

          {!loading && !shop && (
            <p className="text-gray-400 text-center">
              Você ainda não conectou o ShopTurbo à Shopee. Quando você
              autorizar nosso sistema, os dados da sua loja aparecerão aqui.
            </p>
          )}

          {shop?.expire_time && (
            <p className="text-xl mb-4">
              A autorização do ShopTurbo expira em: {expireIn}.
            </p>
          )}

          <p className="text-xl mb-4">
            - Colocar talvez os produtos mais vendidos aqui, foto perfil da loja
            etc...
          </p>
        </div>
      </Main>
    </section>
  );
}
