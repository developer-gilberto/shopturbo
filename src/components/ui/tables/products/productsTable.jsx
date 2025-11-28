'use client';

import { fetchProductsShopee } from '@/api/products/productsShopee/fetchProductsShopee';
import { fetchProductsShopturbo } from '@/api/products/productsShopturbo/fetchProductsShopturbo';
import { fetchShopProfile } from '@/api/shop/fetchShopProfile';
import { useProducts } from '@/context/productContext';
import { useProductPagination } from '@/context/productionPaginationContext';
import { useShop } from '@/context/shopContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IsLoading } from '../../isLoading';
import { Column } from './column';
import { ProductImage } from './productImage';
import { TableData } from './tableData';
import { TableHeader } from './tableHeader';
import { CopyButton } from '../../copyButton';
import { EditCostPriceButton } from '../../editCostPriceButton';
import { EditGovernmentTaxesButton } from '../../editGovernmentTaxesButton';
import { SaveChangesButton } from '../../saveChangesButton';
import { DiscardChangesButton } from '../../discardChangesButton';

export function ProductsTable() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchedShopRef = useRef(false);
  const { shop, setShop } = useShop();
  const {
    hasEditedProduct,
    productsShopee,
    productsShopturbo,
    setInitialProductsShopee,
    setInitialProductsShopturbo,
    setProductsShopee,
    setProductsShopturbo,
  } = useProducts();
  const {
    offsetShopee,
    hasPreviousPage,
    hasNextPageShopturbo,
    hasNextPageShopee,
    pageSizeShopturbo,
    pageSizeShopee,
    currentPage,
    totalNumbersPages,
    setOffsetShopturbo,
    setOffsetShopee,
    setHasPreviousPage,
    setHasNextPageShopturbo,
    setHasNextPageShopee,
    setCurrentPage,
    setTotalNumbersPages,
    setTotalCountShopturbo,
    setTotalCountShopee,
  } = useProductPagination();

  function handleReturnFirstPageProducts() {
    setHasNextPageShopturbo(true);
    setHasNextPageShopee(true);
    setCurrentPage(1);
    setHasPreviousPage(false);

    router.push(`/products?page=1&page_size=${pageSizeShopee}`);
  }

  async function handlePreviousPage() {
    setHasNextPageShopturbo(true);
    setHasNextPageShopee(true);

    const page = searchParams.get('page');

    if (page == 1) {
      setCurrentPage(1);
      setHasPreviousPage(false);
      return;
    }

    setCurrentPage((prevPage) => Number(prevPage) - 1);

    router.back();
  }

  async function handleNextPage() {
    setHasPreviousPage(true);

    const page = searchParams.get('page');

    if (page >= totalNumbersPages) {
      setCurrentPage(totalNumbersPages);
      setHasNextPageShopee(false);
      return;
    }

    setCurrentPage((prevPage) => Number(prevPage) + 1);

    router.push(
      `/products?page=${Number(currentPage) + 1}&page_size=${pageSizeShopee}`,
    );
  }

  async function fetchProducts(page) {
    setCurrentPage(page);

    const off_set_shopturbo = (page - 1) * pageSizeShopturbo;
    const off_set_shopee = (page - 1) * pageSizeShopee;

    try {
      setLoading(true);

      if (hasNextPageShopturbo && hasNextPageShopee) {
        const [responseShopturbo, responseShopee] = await Promise.all([
          fetchProductsShopturbo(off_set_shopturbo, pageSizeShopturbo),
          fetchProductsShopee(off_set_shopee, pageSizeShopee),
        ]);

        if (
          responseShopturbo?.data.length == 0 &&
          responseShopee?.products.length == 0
        ) {
          alert('Nenhum produto encontrado.');

          router.push(`/products?page=1&page_size=${pageSizeShopee}`);
          return;
        }

        // tratar possiveis erros de Promise.all

        const shopturboProductsIDs = new Set(
          responseShopturbo.data.map((product) => product.id),
        );

        const filteredProducts = responseShopee.products.filter(
          (product) => !shopturboProductsIDs.has(product.item_id),
        );

        setOffsetShopturbo(responseShopturbo.pagination.nextOffset);
        setHasNextPageShopturbo(responseShopturbo.pagination.hasNextPage);
        setTotalCountShopturbo(responseShopturbo.pagination.totalProducts);

        setOffsetShopee(responseShopee.pagination.nextOffset);
        setHasNextPageShopee(responseShopee.pagination.hasNextPage);
        setTotalCountShopee(responseShopee.pagination.totalProducts);

        setTotalNumbersPages(
          Math.ceil(
            (Number(responseShopturbo.pagination.totalProducts) +
              Number(responseShopee.pagination.totalProducts)) /
              Number(pageSizeShopee),
          ),
        );

        setInitialProductsShopturbo(responseShopturbo.data);
        setProductsShopturbo(responseShopturbo.data);

        setInitialProductsShopee(filteredProducts);
        setProductsShopee(filteredProducts);
        return;
      }

      if (hasNextPageShopee) {
        const response = await fetchProductsShopee(
          (page - 1) * pageSizeShopee,
          pageSizeShopee,
        );

        setOffsetShopee(response.pagination.nextOffset);
        setHasNextPageShopee(response.pagination.hasNextPage);
        setTotalCountShopee(response.pagination.totalProducts);

        setInitialProductsShopturbo([]);
        setProductsShopturbo([]); // talvez possa pegar os ultimos produtos (...prevProducts) para filtrar os productsShopee para nao aparecer os q ja foram colocados precos
        setInitialProductsShopee(response.products);
        setProductsShopee(response.products);
        return;
      }
    } catch (err) {
      console.error('Ocorreu um erro ao tentar buscar os produtos: ' + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchShop() {
      if (fetchedShopRef.current) return;
      fetchedShopRef.current = true;

      if (shop) {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, []);

  useEffect(() => {
    if (!shop) return;

    const page = searchParams.get('page');

    if (page == 1 || !page) {
      setCurrentPage(1);
      setHasPreviousPage(false);
    }

    fetchProducts(page);
  }, [shop, searchParams]);

  if (!shop) {
    return (
      <>
        {loading ? (
          <IsLoading />
        ) : (
          <p className="text-gray-400 text-center">
            Você ainda não conectou o ShopTurbo à Shopee. Quando você autorizar
            nosso sistema, os produtos da sua loja aparecerão aqui.
          </p>
        )}
      </>
    );
  }

  if (productsShopee.length === 0 && productsShopturbo.length === 0) {
    return (
      <>
        {loading ? (
          <IsLoading />
        ) : (
          <p className="text-gray-400 text-center">
            Nenhum produto encontrado.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {loading && <IsLoading />}

      {!loading && hasEditedProduct && (
        <div className="w-full flex flex-col justify-center items-center gap-1 mb-4 absolute top-0 z-50 bg-[--bg_5]">
          <p className="text-yellow-400">
            ⚠️ Você fez algumas alterações! Quando terminar de fazer todas as
            alterações que deseja, escolha uma das opções abaixo:
          </p>
          <div className="flex justify-center items-start gap-4">
            <DiscardChangesButton />

            <SaveChangesButton />
          </div>
        </div>
      )}

      <table className="relative min-w-full mt-4 text-center border-collapse border border-[--bg_4]">
        <TableHeader />

        <tbody>
          {productsShopturbo &&
            productsShopturbo.map((product) => {
              return (
                <tr
                  key={`shopturbo-${String(product.id)}-${String(product.shopId)}`}
                  className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
                >
                  {/* Coluna produto*/}
                  <Column>
                    <div className="flex justify-start items-center gap-2 min-w-full">
                      <ProductImage
                        url={product.imageUrl}
                        name={product.name}
                        width="48"
                        height="48"
                      />

                      <div className="flex flex-col justify-center items-start">
                        <TableData customStyle="font-bold">
                          {product.name}
                        </TableData>

                        <TableData customStyle="font-md text-gray-400">
                          ID categoria: {product.categoryId}
                        </TableData>
                      </div>
                    </div>
                  </Column>

                  {/* Coluna ID */}
                  <Column>
                    <TableData>
                      {product.id}
                      <CopyButton text={product.id} />
                    </TableData>
                  </Column>

                  {/* Coluna SKU */}
                  <Column>
                    <TableData>
                      {product.sku}
                      <CopyButton text={product.sku} />
                    </TableData>
                  </Column>

                  {/* Coluna Estoque */}
                  <Column>
                    <TableData>{product.stock}</TableData>
                  </Column>

                  {/* Coluna Preço de venda */}
                  <Column>
                    <TableData>
                      {Number(product.sellingPrice).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableData>
                  </Column>

                  {/* Coluna Preço de custo */}
                  <Column>
                    <TableData>
                      {product?.costPrice
                        ? Number(product.costPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : Number(0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                      <EditCostPriceButton
                        editedProductId={product.id}
                        fromShopturbo={true}
                      />
                    </TableData>
                  </Column>

                  {/* Coluna imposto % */}
                  <Column>
                    <TableData>
                      {product?.governmentTaxes ? product.governmentTaxes : 0} %
                      <EditGovernmentTaxesButton
                        editedProductId={product.id}
                        fromShopturbo={true}
                      />
                    </TableData>
                  </Column>
                </tr>
              );
            })}
          {productsShopee &&
            productsShopee.map((product) => {
              return (
                <tr
                  key={`shopee-${String(product.item_id)}`}
                  className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
                >
                  {/* Coluna produto*/}
                  <Column>
                    <div className="flex justify-start items-center gap-2 min-w-full">
                      <ProductImage
                        url={product.image?.image_url_list[0]}
                        name={product.item_name}
                        width="48"
                        height="48"
                      />

                      <div className="flex flex-col justify-center items-start">
                        <TableData customStyle="font-bold">
                          {product.item_name}
                        </TableData>

                        <TableData customStyle="font-md text-gray-400">
                          ID categoria: {product.category_id}
                        </TableData>
                      </div>
                    </div>
                  </Column>

                  {/* Coluna ID */}
                  <Column>
                    <TableData>
                      {product.item_id}
                      <CopyButton text={product.item_id} />
                    </TableData>
                  </Column>

                  {/* Coluna SKU */}
                  <Column>
                    <TableData>
                      {product.item_sku}
                      <CopyButton text={product.item_sku} />
                    </TableData>
                  </Column>

                  {/* Coluna Estoque */}
                  <Column>
                    <TableData>
                      {product.stock_info_v2.summary_info.total_available_stock}
                    </TableData>
                  </Column>

                  {/* Coluna Preço de venda */}
                  <Column>
                    <TableData>
                      {Number(
                        product.price_info[0].current_price,
                      ).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableData>
                  </Column>

                  {/* Coluna Preço de custo */}
                  <Column>
                    <TableData>
                      {product?.item_cost_price ? (
                        Number(product.item_cost_price).toLocaleString(
                          'pt-BR',
                          {
                            style: 'currency',
                            currency: 'BRL',
                          },
                        )
                      ) : (
                        <div className="text-gray-400">⚠️ Não informado</div>
                      )}
                      <EditCostPriceButton
                        editedProductId={product.item_id}
                        fromShopturbo={false}
                      />
                    </TableData>
                  </Column>

                  {/* Coluna imposto % */}
                  <Column>
                    <TableData>
                      {product?.item_government_taxes ? (
                        product.item_government_taxes + '%'
                      ) : (
                        <div className="text-gray-400">⚠️ Não informado</div>
                      )}
                      <EditGovernmentTaxesButton
                        editedProductId={product.item_id}
                        fromShopturbo={false}
                      />
                    </TableData>
                  </Column>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="flex flex-col justify-center items-center gap-4 my-4">
        {loading && <IsLoading width="w-80" />}

        <button
          className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
            !hasPreviousPage ||
            Number(offsetShopee) - Number(pageSizeShopee) == 0
              ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
              : 'hover:cursor-pointer'
          }`}
          onClick={handleReturnFirstPageProducts}
          disabled={
            !hasPreviousPage ||
            Number(offsetShopee) - Number(pageSizeShopee) == 0
          }
        >
          Voltar para primeira página
        </button>

        <div className="flex justify-center items-center gap-4">
          <button
            className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
              !hasPreviousPage ||
              Number(offsetShopee) - Number(pageSizeShopee) == 0
                ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
                : 'hover:cursor-pointer'
            }`}
            onClick={handlePreviousPage}
            disabled={
              !hasPreviousPage ||
              Number(offsetShopee) - Number(pageSizeShopee) == 0
            }
          >
            <FaArrowLeft /> Anterior
          </button>

          <button
            className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
              !hasNextPageShopturbo && !hasNextPageShopee
                ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
                : 'hover:cursor-pointer'
            }`}
            onClick={handleNextPage}
            disabled={!hasNextPageShopturbo && !hasNextPageShopee}
          >
            Próximo <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
