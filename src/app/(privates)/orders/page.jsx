"use client";

import { fetchOrdersDetails } from "@/api/orders/fetchOrdersDetails";
import { fetchOrdersIdList } from "@/api/orders/fetchOrdersIdList";
import { fetchProductsShopturbo } from "@/api/products/productsShopturbo/fetchProductsShopturbo";
import { fetchShopProfile } from "@/api/shop/fetchShopProfile";
import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/buttons/btn";
import { CopyButton } from "@/components/ui/buttons/copyButton";
import { IsLoading } from "@/components/ui/isLoading";
import { ProductImage } from "@/components/ui/tables/products/productImage";
import { useOrder } from "@/context/orderContext";
import { useProducts } from "@/context/productContext";
import { useShop } from "@/context/shopContext";
import { useEffect, useRef, useState } from "react";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [inputOrderStatus, setInputOrderStatus] = useState("");
  const [governmentTaxes, setGovernmentTaxes] = useState(10);
  const [totalGovernmentTaxes, setTotalGovernmentTaxes] = useState(0);
  const [totalShopeeCommission, setTotalShopeeCommission] = useState(0);
  const [totalCostPrice, setTotalCostPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [numberOfOrdersFound, setNumberOfOrdersFound] = useState(0);
  const { shop, setShop } = useShop();
  const { orders, setOrders } = useOrder();
  const { productsShopturbo, setProductsShopturbo } = useProducts();
  const fetchedShopRef = useRef(false);

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

  async function fetchOrders() {
    const orderStatus = inputOrderStatus ? inputOrderStatus : "READY_TO_SHIP";

    try {
      setLoading(true);

      // "UNPAID", "READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "IN_CANCEL", "CANCELLED", "INVOICE_PENDING"
      // "NÃO PAGO", "PRONTO_PARA_ENVIO", "PROCESSADO", "ENVIADO", "CONCLUÍDO", "CANCELADO", "CANCELADO", "FATURA_PENDENTE"

      const response = await fetchOrdersIdList(orderStatus);

      setNumberOfOrdersFound(response.data?.order_list.length);

      if (response.status !== 200) {
        console.log(response);
        return;
      }

      const ordersIdList = response.data.order_list.map(
        (order) => order.order_sn,
      );

      const [ordersData, products] = await Promise.all([
        fetchOrdersDetails(ordersIdList),
        fetchProductsShopturbo(0, 100), // ESTOU BUSCANDO PRODUTOS ALEATORIOS. DEVO BUSCAR OS PRODUTOS QUE ESTAO NAS ORDERS QUE O USUARIO ESTA BUSCANDO
      ]);

      if (ordersData.status !== 200) {
        setInputOrderStatus("");
        return setOrders([]);
      }
      if (products.status !== 200) return;

      const ordersDetails = ordersData.data.order_list.map((order) => ({
        order_sn: order.order_sn,
        order_status: order.order_status,
        item_list: order.item_list.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_sku: item.item_sku,
          model_original_price: item.model_original_price,
          model_discounted_price: item.model_discounted_price,
          model_quantity_purchased: item.model_quantity_purchased,
          image_url: item.image_info.image_url,
        })),
        total_amount: order.total_amount,
        buyer_username: order.buyer_username,
        buyer_user_id: order.buyer_user_id,
        shipping_carrier: order.shipping_carrier,
        estimated_shipping_fee: order.estimated_shipping_fee,
        actual_shipping_fee_confirmed: order.actual_shipping_fee_confirmed,
        actual_shipping_fee: order.actual_shipping_fee
          ? order.actual_shipping_fee
          : order.estimated_shipping_fee,
        payment_method: order.payment_method,
        invoice_data: order.invoice_data.total_value,
      }));

      setOrders(ordersDetails);
      setProductsShopturbo(products.data);

      const totalValueOrdersWithShipping = ordersDetails.reduce(
        (acc, orders) => {
          const totalOrder = orders.item_list.reduce(
            (sum, item) =>
              sum + item.model_original_price * item.model_quantity_purchased,
            0,
          );
          return acc + totalOrder;
        },
        0,
      );

      const totalShopeeCommission = ordersDetails.reduce((_acc, order) => {
        const totalCommission = order.item_list.reduce(
          (acc, item) =>
            acc +
            (Number(item.model_original_price) -
              Number(item.model_discounted_price)) *
              Number(item.model_quantity_purchased),
          0,
        );
        return totalCommission;
      }, 0);

      const totalCostPrice = ordersDetails.reduce((acc1, order) => {
        const orderCost = order.item_list.reduce((acc2, item) => {
          const product = products.data.find(
            (product) => product.id === item.item_id,
          );
          const costPrice = product ? product.costPrice : 0;
          return acc2 + costPrice * item.model_quantity_purchased;
        }, 0);
        return acc1 + orderCost;
      }, 0);

      const totalGovernmentTaxes =
        totalValueOrdersWithShipping * (governmentTaxes / 100);

      const totalCostPriceWithTaxesAndCommission =
        totalCostPrice + totalGovernmentTaxes + totalShopeeCommission;

      const totalValueOrders = ordersDetails.reduce((acc1, orders) => {
        const totalOrder = orders.item_list.reduce(
          (acc2, item) =>
            acc2 +
            Number(item.model_original_price) *
              Number(item.model_quantity_purchased),
          0,
        );
        return acc1 + totalOrder;
      }, 0);

      const totalProfit =
        totalValueOrders - totalCostPriceWithTaxesAndCommission;

      setTotalGovernmentTaxes(totalGovernmentTaxes);
      setTotalShopeeCommission(totalShopeeCommission);
      setTotalCostPrice(totalCostPriceWithTaxesAndCommission);
      setTotalProfit(totalProfit);
    } catch (err) {
      console.error("[ ERROR ]: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (shop) fetchOrders();
  }, []);

  if (!shop) {
    return (
      <section className=" w-full min-h-screen flex">
        <Nav />
        <Main>
          <p className="text-gray-400 text-center">
            Você ainda não conectou o ShopTurbo à Shopee. Quando você autorizar
            nosso sistema, os pedidos da sua loja aparecerão aqui.
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
          <section>
            <div className="flex items-center gap-2">
              <select
                className="bg-transparent border border-[--bg_3] p-2 rounded-md text-gray-100 focus:outline-none focus:border-[--primary]"
                value={inputOrderStatus}
                onChange={(e) => setInputOrderStatus(e.target.value)}
              >
                <option value="" disabled>
                  Buscar pedidos por status
                </option>
                <option value="UNPAID">AGUARDANDO PAGAMENTO</option>
                <option value="INVOICE_PENDING">FATURA PENDENTE</option>
                <option value="READY_TO_SHIP">PRONTOS PARA ENVIO</option>
                <option value="SHIPPED">ENVIADOS</option>
                <option value="IN_CANCEL">EM CANCELAMENTO</option>
                <option value="CANCELLED">CANCELADOS</option>
                <option value="PROCESSED">PROCESSADOS</option>
                <option value="COMPLETED">CONCLUÍDOS</option>
              </select>
              <Button onClick={fetchOrders}>Buscar</Button>
            </div>

            {shop && orders.length >= 0 && (
              <div>
                <div className="text-xl font-bold my-4">
                  <p>
                    {!numberOfOrdersFound &&
                      "Nenhum pedido encontrado para essa busca"}
                  </p>
                </div>
              </div>
            )}

            {loading && <IsLoading width="w-[340px]" />}
          </section>

          <section className="max-h-dvh overflow-y-auto rounded-md border border-[--bg_5] my-4">
            <table className="min-w-full text-center border-collapse">
              <thead className="sticky top-0 z-10 bg-[--bg_4] text-gray-400">
                <tr>
                  <th className="p-2">Pedido</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Preço Venda</th>
                  <th className="p-2">Qtd.</th>
                  <th className="p-2">Valor pedido</th>
                  <th className="p-2">Preço Custo</th>
                  <th className="p-2">
                    <span className="flex justify-center items-center gap-2">
                      Imposto %
                    </span>
                  </th>
                  <th className="p-2">Tarifa Shopee</th>
                  <th className="p-2">Frete</th>
                  <th className="p-2">Total custos</th>

                  <th className="p-2">Lucro</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) =>
                  order.item_list.map((item, index) => {
                    function getOrderStatus(status) {
                      const statusMap = {
                        UNPAID: "Aguardando pagamento",
                        READY_TO_SHIP: "Pronto para envio",
                        PROCESSED: "Processado",
                        SHIPPED: "Enviado",
                        COMPLETED: "Concluído",
                        IN_CANCEL: "Em cancelamento",
                        CANCELLED: "Cancelado",
                        INVOICE_PENDING: "Fatura pendente",
                        TO_CONFIRM_RECEIVE:
                          "Aguardando cliente confirmar recebimento",
                      };

                      return statusMap[status] ?? "Status desconhecido";
                    }

                    const currentOrderProduct = productsShopturbo.find(
                      (product) => product.id === item.item_id,
                    );

                    const inputCostPrice = currentOrderProduct
                      ? currentOrderProduct.costPrice
                      : 0;

                    const sellingPrice = Number(item.model_original_price);

                    const sellingPriceWithShopeeFee = Number(
                      item.model_discounted_price,
                    );

                    const shopeeCommission =
                      sellingPrice - sellingPriceWithShopeeFee;

                    const shipping = Number(
                      order.actual_shipping_fee || order.estimated_shipping_fee,
                    );

                    const totalAmountWithShipping = Number(
                      item.model_original_price,
                    );

                    const quantityPurchased = item.model_quantity_purchased;

                    const orderItemQuantityValue =
                      sellingPrice * quantityPurchased;

                    const orderValue =
                      totalAmountWithShipping * quantityPurchased;

                    const costPrice = inputCostPrice * quantityPurchased;

                    const totalGovernmentTaxes =
                      orderValue * (governmentTaxes / 100);

                    const totalCost =
                      costPrice + totalGovernmentTaxes + shopeeCommission;

                    const profit = orderValue - totalCost;

                    return (
                      <tr
                        key={`${order.order_sn}-${item.item_id}-${index}`}
                        className="odd:bg-transparent even:bg-[--bg_5] transition"
                      >
                        {/* Pedido */}
                        <td className="border border-[--bg_3] p-2">
                          <div className="flex justify-start items-center gap-4">
                            <ProductImage
                              url={item.image_url}
                              name={item.item_name}
                              width="48"
                              height="48"
                            />
                            <div className="flex flex-col justify-between items-start gap-1 text-gray-100 uppercase">
                              <span className="font-medium">
                                {item.item_name}
                              </span>

                              <span className="text-xs text-gray-400 flex justify-start items-center gap-1">
                                <span className="flex justify-start items-center">
                                  ID produto: {item.item_id}
                                </span>
                                <CopyButton text={item.item_id} />
                              </span>

                              <span className="text-xs text-gray-400 flex justify-start items-center gap-1">
                                <span className="flex justify-start items-center">
                                  SKU: {item.item_sku}
                                </span>
                                <CopyButton text={item.item_sku} />
                              </span>

                              <span className="text-xs text-gray-400 flex justify-start items-center gap-1">
                                <span className="flex justify-start items-center">
                                  ID Venda: {order.order_sn}
                                </span>
                                <CopyButton text={order.order_sn} />
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="border border-[--bg_3] p-2 text-gray-300 text-center">
                          {getOrderStatus(order.order_status)}
                        </td>

                        {/* Preço de venda */}
                        <td className="border border-[--bg_3] p-2">
                          {sellingPrice.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>

                        {/* Qtd. */}
                        <td className="border border-[--bg_3] p-2 text-gray-300 text-center">
                          x {quantityPurchased}
                        </td>

                        {/* Valor total pedido */}
                        <td className="border border-[--bg_3] p-2 text-blue-400">
                          {orderItemQuantityValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>

                        {/* Preço de custo */}
                        <td className="border border-[--bg_3] p-2 text-yellow-300">
                          {currentOrderProduct?.costPrice
                            ? inputCostPrice.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : "⚠️ Não informado"}
                        </td>

                        {/* Imposto */}
                        <td className="border border-[--bg_3] p-2">
                          {governmentTaxes}%
                          <div className="p-2 text-yellow-300">
                            {totalGovernmentTaxes.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </td>

                        {/* Comissão Shopee */}
                        <td className="border border-[--bg_3] p-2 text-yellow-300">
                          {shopeeCommission.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>

                        {/* Frete */}
                        <td className="border border-[--bg_3] p-2">
                          {shipping.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>

                        {/* Total de custos */}
                        <td className="border border-[--bg_3] p-2 text-orange-400">
                          {totalCost.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>

                        {/* Lucro */}
                        <td
                          className={`border border-[--bg_3] p-2 font-bold ${profit >= 0 ? "text-green-500" : "text-red-600"}`}
                        >
                          {profit.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>

              {orders.length > 0 && (
                <tfoot>
                  <tr className="bg-[--bg_4] text-gray-400">
                    <td colSpan={11} className="text-center p-4">
                      TOTAL GERAL
                    </td>
                  </tr>

                  <tr className="">
                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    {/* Qtd. produtos vendidos */}
                    <th className="py-4 px-2 border border-[--bg_3]">
                      {orders.reduce((acc1, order) => {
                        const totalOrder = order.item_list.reduce(
                          (acc2, item) => acc2 + item.model_quantity_purchased,
                          0,
                        );
                        return acc1 + totalOrder;
                      }, 0)}
                    </th>

                    {/* Total vendas */}
                    <th className="py-4 px-2 border border-[--bg_3] text-blue-400">
                      {Number(
                        orders.reduce((acc1, orders) => {
                          const totalOrder = orders.item_list.reduce(
                            (acc2, item) =>
                              acc2 +
                              item.model_original_price *
                                item.model_quantity_purchased,
                            0,
                          );
                          return acc1 + totalOrder;
                        }, 0),
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </th>

                    {/* Total preco custo */}
                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    {/* Total impostos */}
                    <th className="py-4 px-2 border border-[--bg_3] text-yellow-300">
                      {Number(totalGovernmentTaxes).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </th>

                    {/* Total comissao shopee */}
                    <th className="py-4 px-2 border border-[--bg_3] text-yellow-300">
                      {Number(totalShopeeCommission).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </th>

                    {/* Total frete */}
                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    {/* Total custos pedidos */}
                    <th className="py-4 px-2 border border-[--bg_3] text-orange-400">
                      {Number(totalCostPrice).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </th>

                    {/* Total lucros */}
                    <th
                      className={`py-4 px-2 border border-[--bg_3] font-extrabold ${totalProfit >= 0 ? "text-green-500" : "text-red-600"}`}
                    >
                      {Number(totalProfit).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </th>
                  </tr>
                </tfoot>
              )}
            </table>
          </section>
        </div>
      </Main>
    </section>
  );
}
