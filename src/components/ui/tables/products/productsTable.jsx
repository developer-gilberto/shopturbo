'use client';

import { fetchProductsShopee } from '@/api/products/productsShopee/fetchProductsShopee';
import { fetchProductsShopturbo } from '@/api/products/productsShopturbo/fetchProductsShopturbo';
import { saveProducts } from '@/api/products/productsShopturbo/saveProducts';
import { fetchShopProfile } from '@/api/shop/fetchShopProfile';
import { useProducts } from '@/context/productContext';
import { useProductPagination } from '@/context/productionPaginationContext';
import { useShop } from '@/context/shopContext';
import { useEffect, useRef, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RxCopy } from 'react-icons/rx';
import { Button } from '../../btn';
import { IsLoading } from '../../isLoading';
import { Column } from './column';
import { ProductImage } from './productImage';
import { TableData } from './tableData';
import { TableHeader } from './tableHeader';

export function ProductsTable() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasEditedProduct, setHasEditedProduct] = useState(false);
  const [initialProductsShopee, setInitialProductsShopee] = useState([]);
  const [initialProductsShopturbo, setInitialProductsShopturbo] = useState([]);
  const [productsShopturboLoaded, setProductsShopturboLoaded] = useState(false);
  const [shopeeProductsRequested, setShopeeProductsRequested] = useState(false);
  const fetchedShopRef = useRef(false);
  const loadedShopturboRef = useRef(false);
  const { shop, setShop } = useShop();
  const {
    productsShopee,
    productsShopturbo,
    setProductsShopee,
    setProductsShopturbo,
  } = useProducts();
  const {
    offsetShopturbo,
    offsetShopee,
    hasNextPageShopturbo,
    hasNextPageShopee,
    setOffsetShopturbo,
    setOffsetShopee,
    setHasNextPageShopturbo,
    setHasNextPageShopee,
  } = useProductPagination();

  async function getProductsShopturbo(off_set, page_size) {
    if (!shop) return;

    try {
      setLoading(true);

      const response = await fetchProductsShopturbo(off_set, page_size);

      if (response.status !== 200) {
        alert('Erro ao tentar buscar dados no Shopturbo!');
        return;
      }

      setInitialProductsShopturbo((prevProducts) => [
        ...prevProducts,
        ...response.data,
      ]);
      setProductsShopturbo((prevProducts) => [
        ...prevProducts,
        ...response.data,
      ]);

      setOffsetShopturbo(response.pagination.nextOffset);
      setHasNextPageShopturbo(response.pagination.hasNextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function getProductsShopee(off_set, page_size) {
    if (!shop) return;

    if (hasNextPageShopturbo) return;
    if (!hasNextPageShopee) return;

    try {
      setLoading(true);

      const response = await fetchProductsShopee(off_set, page_size);

      const productsShopturboIDs = new Set(
        productsShopturbo.map((product) => product.id)
      );

      const filteredShopee = response.products.filter(
        (product) => !productsShopturboIDs.has(product.item_id)
      );

      setInitialProductsShopee((prevProducts) => [
        ...prevProducts,
        ...filteredShopee,
      ]);

      setProductsShopee((prevProducts) => [...prevProducts, ...filteredShopee]);

      setOffsetShopee(response.pagination.nextOffset);
      setHasNextPageShopee(response.pagination.hasNextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      const ref = setTimeout(() => setCopied(false), 500);
      return () => {
        clearTimeout(ref);
      };
    } catch (err) {
      alert('Não foi possível copiar!');
    }
  }

  function handleInputGovernmentTaxes(editedProductId, itsShopturboProduct) {
    const inputTaxes = prompt('Digite o valor do imposto %: ');

    if (inputTaxes === null) return;

    if (inputTaxes.trim() === '') {
      alert('⚠️ Você não digitou nada!');
      return;
    }

    const inputGovernmentTaxes = Number(inputTaxes);

    if (Number.isNaN(inputGovernmentTaxes)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }

    if (itsShopturboProduct) {
      const newProductsShopturbo = productsShopturbo.map((product) =>
        String(product.id) === String(editedProductId)
          ? {
              ...product,
              governmentTaxes: inputGovernmentTaxes,
              edited_product: true,
            }
          : product
      );

      setProductsShopturbo(newProductsShopturbo);
      setHasEditedProduct(true);
      return;
    }

    const newProducts = productsShopee.map((product) =>
      String(product.item_id) === String(editedProductId)
        ? {
            ...product,
            item_government_taxes: inputGovernmentTaxes,
            edited_product: true,
          }
        : product
    );

    setProductsShopee(newProducts);
    setHasEditedProduct(true);
  }

  function handleInputCostPrice(editedProductId, itsShopturboProduct) {
    const inputCostPrice = prompt(
      'Digite o preço de custo (para números com vírgula, digite ponto no lugar da vírgula): '
    );

    if (inputCostPrice === null) return;

    if (inputCostPrice.trim() === '') {
      alert('⚠️ Você não digitou nada!');
      return;
    }

    const costPrice = Number(inputCostPrice);

    if (Number.isNaN(costPrice)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }

    if (itsShopturboProduct) {
      const newProductsShopturbo = productsShopturbo.map((product) =>
        String(product.id) === String(editedProductId)
          ? {
              ...product,
              costPrice: costPrice,
              edited_product: true,
            }
          : product
      );

      setProductsShopturbo(newProductsShopturbo);
      setHasEditedProduct(true);
      return;
    }

    const newProducts = productsShopee.map((product) =>
      String(product.item_id) === String(editedProductId)
        ? {
            ...product,
            item_cost_price: costPrice,
            edited_product: true,
          }
        : product
    );

    setProductsShopee(newProducts);
    setHasEditedProduct(true);
  }

  async function handleSaveProducts() {
    const editedProductsFromShopee = productsShopee.filter(
      (product) => product.edited_product
    );
    const uneditedProductsFromShopee = productsShopee.filter(
      (product) => !product.edited_product
    );

    const editedProductsFromShopturbo = productsShopturbo.filter(
      (product) => product.edited_product
    );
    const uneditedProductsFromShopturbo = productsShopturbo.filter(
      (product) => !product.edited_product
    );

    const editedProductsShopeeInCamelCase = editedProductsFromShopee.map(
      (product) => ({
        id: product.item_id,
        sku: product.item_sku,
        categoryId: product.category_id,
        name: product.item_name,
        stock: product.stock_info_v2.summary_info.total_available_stock,
        sellingPrice: product.price_info[0].current_price,
        costPrice: product?.item_cost_price ? product.item_cost_price : 0,
        governmentTaxes: product?.item_government_taxes
          ? product.item_government_taxes
          : 0,
        imageUrl: product.image?.image_url_list[0],
      })
    );

    const productsToSave = [
      ...editedProductsShopeeInCamelCase,
      ...editedProductsFromShopturbo,
    ];

    try {
      setLoading(true);

      const response = await saveProducts(productsToSave);

      if (response.status != 201) {
        alert('Ocorreu um erro ao tentar salvar os dados!');
        return;
      }

      setProductsShopturbo([
        ...uneditedProductsFromShopturbo,
        ...editedProductsFromShopturbo,
        ...editedProductsShopeeInCamelCase,
      ]);
      setInitialProductsShopturbo(
        JSON.parse(
          JSON.stringify([
            ...uneditedProductsFromShopturbo,
            ...editedProductsFromShopturbo,
            ...editedProductsShopeeInCamelCase,
          ])
        )
      );

      setInitialProductsShopee(
        JSON.parse(JSON.stringify(uneditedProductsFromShopee))
      );
      setProductsShopee(uneditedProductsFromShopee);
      setHasEditedProduct(false);

      alert('Dados salvos com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar salvar os dados!');
    } finally {
      setLoading(false);
    }
  }

  function discardChanges() {
    setProductsShopturbo(initialProductsShopturbo);
    setProductsShopee(initialProductsShopee);
    setHasEditedProduct(false);
  }

  async function loadProductsShopturbo() {
    if (hasNextPageShopturbo) {
      await getProductsShopturbo(offsetShopturbo, 100);
    }
    setProductsShopturboLoaded(true);
    setShopeeProductsRequested((prev) => !prev);
  }

  useEffect(() => {
    // posso carregar a pagina pela primeira vez com um query params default (offset=0, pagesize=100). entao qdo o usuario clicar em proxima pagina eu chamo loadProductShopturbo e passo o offsetShopturbo e pagesize como query params ou uso router.push(/products?offset=3&page_size=100)

    // NAV -> href="/products?offset=0&page_size=3"
    // const searchParams = new URLSearchParams(window.location.search);
    // const offset = searchParams.get('offset');
    // const pageSize = searchParams.get('page_size');

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
    if (!shop || loadedShopturboRef.current) return;
    loadedShopturboRef.current = true;

    if (productsShopee.length > 0) return;

    loadProductsShopturbo();
  }, [shop]);

  useEffect(() => {
    async function loadProductsShopee() {
      if (productsShopturboLoaded && hasNextPageShopee) {
        await getProductsShopee(offsetShopee, 3);
      }
      setProductsShopturboLoaded(false);
    }

    loadProductsShopee();
  }, [shopeeProductsRequested]);

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

      {copied && (
        <div className="bg-green-700 p-1 text-sm text-white font-bold absolute top-8 left-1/2 z-50">
          Copiado!
        </div>
      )}

      {!loading && hasEditedProduct && (
        <div className="w-full flex flex-col justify-center items-center gap-1 mb-4 absolute top-0 z-50 bg-[--bg_5]">
          <p className="text-yellow-400">
            ⚠️ Você fez algumas alterações! Quando terminar de fazer todas as
            alterações que deseja, escolha uma das opções abaixo:
          </p>
          <div className="flex justify-center items-start gap-4">
            <button
              className="bg-[--bg_3] flex justify-center items-center gap-2
                         text-white text-nowrap px-2 py-1 rounded-md font-extrabold hover:bg-[--bg_2]"
              onClick={discardChanges}
            >
              Desfazer alterações
            </button>
            <Button onClick={handleSaveProducts}>Salvar alterações</Button>
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
                  key={`shopturbo-${String(product.id)}-${String(
                    product.shopId
                  )}`}
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
                      <RxCopy
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() => copy(product.id)}
                      />
                    </TableData>
                  </Column>

                  {/* Coluna SKU */}
                  <Column>
                    <TableData>
                      {product.sku}
                      <RxCopy
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() => copy(product.sku)}
                      />
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

                      <FaRegEdit
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() => handleInputCostPrice(product.id, true)}
                      />
                    </TableData>
                  </Column>

                  {/* Coluna imposto % */}
                  <Column>
                    <TableData>
                      {product?.governmentTaxes ? product.governmentTaxes : 0} %
                      <FaRegEdit
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() =>
                          handleInputGovernmentTaxes(product.id, true)
                        }
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
                      <RxCopy
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() => copy(product.item_id)}
                      />
                    </TableData>
                  </Column>

                  {/* Coluna SKU */}
                  <Column>
                    <TableData>
                      {product.item_sku}
                      <RxCopy
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() => copy(product.item_sku)}
                      />
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
                        product.price_info[0].current_price
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
                          }
                        )
                      ) : (
                        <div className="text-gray-400">⚠️ Não informado</div>
                      )}

                      <FaRegEdit
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() =>
                          handleInputCostPrice(product.item_id, false)
                        }
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
                      <FaRegEdit
                        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={() =>
                          handleInputGovernmentTaxes(product.item_id, false)
                        }
                      />
                    </TableData>
                  </Column>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="flex flex-col justify-center items-center my-4">
        {hasNextPageShopee && (
          <button
            className="bg-[--bg_3] font-bold p-2 rounded-md hover:cursor-pointer hover:bg-[--bg_4] hover:text-white"
            onClick={loadProductsShopturbo}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Mais produtos aqui'}
          </button>
        )}

        {!hasNextPageShopee && (
          <p>
            Não existem mais produtos para serem carregados. Todos os produtos
            foram carregados.
          </p>
        )}
      </div>
    </>
  );
}
