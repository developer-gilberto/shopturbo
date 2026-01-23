'use client';

import { useProducts } from '@/context/productContext';
import { CopyButton } from '../../buttons/copyButton';
import { EditCostPriceSearchButton } from '../../buttons/editCostPriceSearchButton';
import { Column } from './column';
import { ProductImage } from './productImage';
import { TableData } from './tableData';

export function ProductSearchTable() {
  const { productsFound } = useProducts();

  if (!productsFound) return;

  return (
    <>
      {productsFound.length > 0 && (
        <div>
          <p className="text-xl text-[--bg_1]">Resultado da busca</p>

          {productsFound.length > 1 ? (
            <p className="text-lg">
              {productsFound.length} produtos encontrados:{' '}
            </p>
          ) : (
            <p className="text-lg">
              {productsFound.length} produto encontrado:{' '}
            </p>
          )}

          <table className="min-w-full mt-4 text-center border-collapse border border-[--bg_4]">
            <tbody>
              {productsFound.length > 0 &&
                productsFound.map((product) => (
                  <tr
                    key={product.item_id}
                    className="odd:bg-transparent even:bg-[--bg_5] border-t border-[--bg_4] transition"
                  >
                    <Column>
                      <ProductImage
                        url={product.image?.image_url_list[0]}
                        name={product.item_name}
                        width="48"
                        height="48"
                      />
                      <TableData>{product.item_name}</TableData>
                    </Column>
                    <Column>
                      <TableData>
                        ID: {product.item_id}
                        <CopyButton text={product.item_id} />
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        SKU: {product.item_sku}
                        <CopyButton text={product.item_sku} />
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        Estoque:{' '}
                        {
                          product.stock_info_v2.summary_info
                            .total_available_stock
                        }
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        Preço de venda: {product.price_info?.[0]?.current_price}
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        Preço de custo:{' '}
                        {product?.costPrice ? (
                          Number(product.costPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        ) : (
                          <div className="text-gray-400">⚠️ Não informado</div>
                        )}
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        Imposto:{' '}
                        {product?.governmentTaxes ? (
                          product.governmentTaxes + '%'
                        ) : (
                          <div className="text-gray-400">⚠️ Não informado</div>
                        )}
                      </TableData>
                    </Column>
                    <Column>
                      <TableData>
                        Editar
                        <EditCostPriceSearchButton
                          editedProductId={product.item_id}
                          fromShopturbo={false}
                        />
                      </TableData>
                    </Column>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
