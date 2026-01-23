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
import { CopyButton } from '../../buttons/copyButton';
import { DiscardChangesButton } from '../../buttons/discardChangesButton';
import { DiscardChangesProductFoundButton } from '../../buttons/discardChangesInProductFoundButton';
import { EditCostPriceButton } from '../../buttons/editCostPriceButton';
import { EditGovernmentTaxesButton } from '../../buttons/editGovernmentTaxesButton';
import { SaveChangesButton } from '../../buttons/saveChangesButton';
import { IsLoading } from '../../isLoading';
import { Column } from './column';
import { ProductImage } from './productImage';
import { TableData } from './tableData';
import { TableHeader } from './tableHeader';

export function ProductsTable() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchedShopRef = useRef(false);
  const searchParams = useSearchParams();
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

  const handleReturnFirstPageProducts = () => {
    setCurrentPage(1);
    setHasNextPageShopee(true);
    setHasPreviousPage(false);
    router.push(`/products?page=1&page_size=10`);
  };

  const handlePreviousPage = () => {
    const page = Number(searchParams.get('page') || 1);
    if (page > 1) {
      setCurrentPage(page - 1);
      setHasNextPageShopee(true);
      router.back();
    }
  };

  const handleNextPage = () => {
    const page = Number(searchParams.get('page') || 1);
    setHasPreviousPage(true);
    setCurrentPage(page + 1);
    router.push(`/products?page=${page + 1}&page_size=10`);
  };

  useEffect(() => {
    if (!shop) {
      fetchShopProfile().then((response) => {
        if (response.status === 200) {
          setShop(response.data);
        }
      });
    }
  }, []);

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
        setProductsShopturbo([]);
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

  if ((!shop && loading) || (shop && loading)) {
    return <IsLoading />;
  }

  if (!shop) {
    return (
      <p className="text-gray-400 text-center">
        Você ainda não conectou o ShopTurbo à Shopee. Quando você autorizar
        nosso sistema, os produtos da sua loja aparecerão aqui.
      </p>
    );
  }

  if (productsShopee.length === 0 && productsShopturbo.length === 0) {
    return (
      <p className="text-gray-400 text-center">Nenhum produto encontrado.</p>
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
            <DiscardChangesProductFoundButton />
            <DiscardChangesButton />
            <SaveChangesButton />
          </div>
        </div>
      )}

      <table className="relative min-w-full mt-4 text-center border-collapse">
        <TableHeader />

        <tbody>
          {productsShopturbo.map((product) => (
            <tr
              key={`shopturbo-${String(product.id)}-${String(product.shopId)}`}
              className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
            >
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

              <Column>
                <TableData>
                  {product.id}
                  <CopyButton text={product.id} />
                </TableData>
              </Column>

              <Column>
                <TableData>
                  {product.sku}
                  <CopyButton text={product.sku} />
                </TableData>
              </Column>

              <Column>
                <TableData>{product.stock}</TableData>
              </Column>

              <Column>
                <TableData>
                  {Number(product.sellingPrice).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableData>
              </Column>

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
          ))}

          {productsShopee.map((product) => (
            <tr
              key={`shopee-${String(product.item_id)}`}
              className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
            >
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

              <Column>
                <TableData>
                  {product.item_id}
                  <CopyButton text={product.item_id} />
                </TableData>
              </Column>

              <Column>
                <TableData>
                  {product.item_sku}
                  <CopyButton text={product.item_sku} />
                </TableData>
              </Column>

              <Column>
                <TableData>
                  {product.stock_info_v2.summary_info.total_available_stock}
                </TableData>
              </Column>

              <Column>
                <TableData>
                  {Number(product.price_info[0].current_price).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </TableData>
              </Column>

              <Column>
                <TableData>
                  {product?.item_cost_price ? (
                    Number(product.item_cost_price).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  ) : (
                    <div className="text-gray-400">⚠️ Não informado</div>
                  )}
                  <EditCostPriceButton
                    editedProductId={product.item_id}
                    fromShopturbo={false}
                  />
                </TableData>
              </Column>

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
          ))}
        </tbody>
      </table>

      <div className="flex flex-col justify-center items-center gap-4 my-4">
        {loading && <IsLoading width="w-80" />}

        <button
          className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
            !hasPreviousPage
              ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
              : 'hover:cursor-pointer'
          }`}
          onClick={handleReturnFirstPageProducts}
          disabled={!hasPreviousPage}
        >
          Voltar para primeira página
        </button>

        <div className="flex justify-center items-center gap-4">
          <button
            className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
              !hasPreviousPage
                ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
                : 'hover:cursor-pointer'
            }`}
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
          >
            <FaArrowLeft /> Anterior
          </button>

          <button
            className={`flex justify-center items-center gap-1 bg-[--bg_4] py-1 px-2 rounded-md hover:bg-[--bg_3] ${
              !hasNextPageShopee
                ? 'hover:cursor-not-allowed text-gray-600 hover:bg-[--bg_4]'
                : 'hover:cursor-pointer'
            }`}
            onClick={handleNextPage}
            disabled={!hasNextPageShopee}
          >
            Próximo <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
