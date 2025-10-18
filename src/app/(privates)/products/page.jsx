'use client';

import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { useShop } from '@/context/shopContext';
import { useEffect, useState } from 'react';
import { IsLoading } from '@/components/ui/isLoading';
import { useProducts } from '@/context/productContext';
import { fetchProductsIdList } from '@/app/actions/fetchProductsIdList';
import { fetchProductsInfo } from '@/app/actions/fetchProductsInfo';
import { RxCopy } from 'react-icons/rx';
import { FaRegEdit } from 'react-icons/fa';

export default function Products() {
    const [loading, setLoading] = useState(true);
    const { shop, setShop } = useShop();
    const { products, setProducts } = useProducts();

    useEffect(() => {
        async function fetchProducts() {
            if (products && products.length > 0) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const productsList = await fetchProductsIdList();

                if (productsList.status !== 200) {
                    return;
                }

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

        fetchProducts();
    }, [products]);

    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <Main>
                    <div>
                        <section>
                            {shop ? (
                                <div className="text-xl">Produtos</div>
                            ) : (
                                <p>
                                    Você ainda não conectou o ShopTurbo à
                                    Shopee. Quando você autorizar nosso sistema,
                                    os produtos da sua loja aparecerão aqui.
                                </p>
                            )}

                            {loading && <IsLoading width="w-[340px]" />}
                        </section>

                        <section className="overflow-x-auto mt-4 rounded-md border border-[--bg_4]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[--bg_4] text-gray-300">
                                    <tr>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3">ID venda</th>
                                        <th className="p-3">SKU</th>
                                        <th className="p-3">Estoque</th>
                                        <th className="p-3">Preço de Custo</th>
                                        <th className="p-3">Preço de Venda</th>

                                        <th className="p-3">
                                            <span className="flex justify-start items-center gap-4 text-gray-100">
                                                Imposto %{' '}
                                                <FaRegEdit className="text-xl text-gray-300 hover:text-[--bg_2] hover:cursor-pointer" />
                                            </span>
                                        </th>

                                        <th className="p-3">Lucro</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => {
                                        const sellingPrice =
                                            product.price_info[0].current_price;

                                        const inputCostPrice = 4500;
                                        const inputTaxes = 10;

                                        const costPrice = inputCostPrice;

                                        const profit =
                                            sellingPrice -
                                            (costPrice + inputTaxes);

                                        return (
                                            <tr
                                                key={product.item_id}
                                                className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
                                            >
                                                {/* Coluna produto*/}
                                                <td className="p-3 flex items-center gap-3">
                                                    <img
                                                        src={
                                                            product.image
                                                                .image_url_list[0]
                                                        }
                                                        alt={product.item_name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-100">
                                                            {product.item_name}
                                                        </span>

                                                        <span className="text-xs text-gray-400">
                                                            ID produto:{' '}
                                                            {product.item_id}
                                                        </span>

                                                        <span className="text-xs text-gray-400">
                                                            ID categoria:{' '}
                                                            {
                                                                product.category_id
                                                            }
                                                        </span>

                                                        <span className="text-xs text-gray-400">
                                                            SKU:{' '}
                                                            {product.item_sku}
                                                        </span>

                                                        <span className="text-xs text-gray-400">
                                                            ID venda ***
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Coluna ID venda */}
                                                <td className="p-3 text-gray-300">
                                                    <span className="flex justify-start items-center gap-4 text-gray-100">
                                                        ID venda{' '}
                                                        <RxCopy className="text-2xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer" />
                                                    </span>
                                                </td>

                                                {/* Coluna SKU */}
                                                <td className="p-3 text-gray-300">
                                                    <span className="flex justify-start items-center gap-4 text-gray-100">
                                                        {product.item_sku}
                                                        <RxCopy className="text-2xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer" />
                                                    </span>
                                                </td>

                                                {/* Coluna Estoque */}
                                                <td className="p-3 text-gray-300">
                                                    {
                                                        product.stock_info_v2
                                                            .summary_info
                                                            .total_available_stock
                                                    }
                                                </td>

                                                {/* Coluna Preço de custo */}
                                                <td className="p-3 text-gray-300">
                                                    <span className="flex justify-start items-center gap-4 text-gray-100">
                                                        {Number(
                                                            product
                                                                .price_info[0]
                                                                .original_price
                                                        ).toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                        <FaRegEdit className="text-xl text-gray-300 hover:text-[--bg_2] hover:cursor-pointer" />
                                                    </span>
                                                </td>

                                                {/* Coluna Preço de venda */}
                                                <td className="p-3 text-blue-400 font-semibold">
                                                    {Number(
                                                        product.price_info[0]
                                                            .current_price
                                                    ).toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </td>

                                                {/* Coluna imposto % */}
                                                <td className="p-3 text-gray-300">
                                                    <span className="flex justify-start items-center gap-4 text-gray-100">
                                                        R$ 1,99
                                                    </span>
                                                </td>

                                                {/* Coluna Lucro */}
                                                <td
                                                    className={`p-3 font-bold ${
                                                        profit >= 0
                                                            ? 'text-green-400'
                                                            : 'text-red-500'
                                                    }`}
                                                >
                                                    {Number(
                                                        profit
                                                    ).toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </Main>
            </section>
        </>
    );
}
