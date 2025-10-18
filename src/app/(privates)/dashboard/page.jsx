'use client';

import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { useEffect, useState } from 'react';
import { IsLoading } from '@/components/ui/isLoading';
import { fetchProductsIdList } from '@/app/actions/fetchProductsIdList';
import { fetchProductsInfo } from '@/app/actions/fetchProductsInfo';
import { fetchShopProfile } from '@/app/actions/fetchShopProfile';
import { useShop } from '@/context/shopContext';
import { useProducts } from '@/context/productContext';

export default function Dashboard() {
    const { shop, setShop } = useShop();
    const { products, setProducts } = useProducts();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchShopData() {
            if (shop && products && products.length > 0) return;

            try {
                setLoading(true);

                const [shopProfileData, productsList] = await Promise.all([
                    fetchShopProfile(),
                    fetchProductsIdList(),
                ]);

                if (
                    shopProfileData.status !== 200 ||
                    productsList.status !== 200
                ) {
                    return;
                }

                const shopData = shopProfileData.data;
                setShop(shopData);

                const productsIdList = productsList.data.map(
                    (product) => product.item_id
                );

                const productsData = await fetchProductsInfo(productsIdList);

                if (productsData.status !== 200) return;

                const productsInfo = productsData.data.item_list;
                setProducts(productsInfo);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchShopData();
    }, [shop, products]);

    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <Main>
                    <div>
                        {loading && <IsLoading width="w-[340px]" />}

                        {!loading && !shop && (
                            <p className="text-gray-400 text-center">
                                Você ainda não conectou o ShopTurbo à Shopee.
                                Quando você autorizar nosso sistema, os dados da
                                sua loja aparecerão aqui.
                            </p>
                        )}

                        {!loading && products && products.length === 0 && (
                            <p className="text-gray-400 text-center">
                                Nenhum produto encontrado.
                            </p>
                        )}

                        {!loading && products && products.length > 0 && (
                            <p className="text-gray-300 text-center mb-4">
                                Alguns dos produtos da sua loja:
                            </p>
                        )}

                        <section className="grid grid-cols-3 gap-4 rounded-md">
                            {products.map((product) => (
                                <div
                                    key={product.item_id}
                                    className="border border-[--bg_4] rounded-md p-4 flex flex-col items-center"
                                >
                                    <img
                                        src={
                                            product.image
                                                ?.image_url_list?.[0] ||
                                            '/no-image.png'
                                        }
                                        alt={product.item_name}
                                        className="w-32 h-32 object-cover rounded-md mb-2"
                                    />

                                    <h2 className="text-gray-200 font-semibold text-lg">
                                        {product.item_name.toUpperCase()}
                                    </h2>

                                    <p className="text-sm text-gray-400">
                                        SKU: {product.item_sku}
                                    </p>

                                    <p className="text-blue-400 font-bold">
                                        {Number(
                                            product.price_info[0].current_price
                                        ).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </p>

                                    <p className="text-xs text-gray-300">
                                        Estoque:{' '}
                                        {
                                            product.stock_info_v2.summary_info
                                                .total_available_stock
                                        }
                                    </p>
                                </div>
                            ))}
                        </section>
                    </div>
                </Main>
            </section>
        </>
    );
}
