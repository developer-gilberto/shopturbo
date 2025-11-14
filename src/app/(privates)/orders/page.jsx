'use client';

import { fetchOrdersDetails } from '@/api/orders/fetchOrdersDetails';
import { fetchOrdersIdList } from '@/api/orders/fetchOrdersIdList';
import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/btn';
import { IsLoading } from '@/components/ui/isLoading';
import { useOrder } from '@/context/orderContext';
import { useShop } from '@/context/shopContext';
import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RxCopy } from 'react-icons/rx';

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [inputOrderStatus, setInputOrderStatus] = useState('');
  const [governmentTaxes, setGovernmentTaxes] = useState(10);
  const [totalGovernmentTaxes, setTotalGovernmentTaxes] = useState(0);
  const [totalShopeeCommission, setTotalShopeeCommission] = useState(0);
  const [totalCostPrice, setTotalCostPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [numberOfOrdersFound, setNumberOfOrdersFound] = useState(0);
  const { shop, setShop } = useShop();
  const { orders, setOrders } = useOrder();

  function handleInputGovernmentTaxes() {
    const inputGovernmentTaxes = Number(prompt('Digite o valor do imposto: '));

    if (isNaN(inputGovernmentTaxes)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }
    setGovernmentTaxes(inputGovernmentTaxes);
    // setTotalGovernmentTaxes(totalGovernmentTaxes);
    // setTotalShopeeCommission(totalShopeeCommission);
    // setTotalCostPrice(totalCostPrice);
    // setTotalProfit(totalProfit);
  }

  // useEffect(() => {
  async function fetchOrders() {
    const orderStatus = inputOrderStatus;
    console.log(orderStatus);
    // if (orders && orders.length > 0) {
    //     setLoading(false);
    //     return;
    // }

    try {
      setLoading(true);

      // "UNPAID", "READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "IN_CANCEL", "CANCELLED", "INVOICE_PENDING"
      // "NÃO PAGO", "PRONTO_PARA_ENVIO", "PROCESSADO", "ENVIADO", "CONCLUÍDO", "CANCELADO", "CANCELADO", "FATURA_PENDENTE"

      const response = await fetchOrdersIdList(orderStatus); // passar o status como parametro(posso pegar todos os status chamando fetchOrdersIdList() varias vezes com PromiseAll passando um status em cada promise)

      setInputOrderStatus('');
      setNumberOfOrdersFound(response.data.order_list.length);

      // const response = await Promise.all([
      //     fetchOrdersIdList('UNPAID'),
      //     fetchOrdersIdList('READY_TO_SHIP'),
      //     fetchOrdersIdList('PROCESSED'),
      //     fetchOrdersIdList('SHIPPED'),
      //     fetchOrdersIdList('COMPLETED'),
      //     fetchOrdersIdList('IN_CANCEL'),
      //     fetchOrdersIdList('CANCELLED'),
      //     fetchOrdersIdList('INVOICE_PENDING'),
      // ]);

      // .then((values) => {
      //     console.log(values); // Expected output: [3, 42, "foo"]

      //     values
      // })
      // .catch((error) => {
      //     console.error('One of the promises failed:', error);
      // });
      // console.log('response ', response);

      // if (response.includes({ status: !200 })) {
      //     console.log(response);
      //     return;
      // }

      // const ordersList = response.filter(
      //     (ordersList) => ordersList.data.order_list.length > 0
      // );

      // console.log('ordersList ', ordersList);

      // // console.log('resultado PromiseAll: ', ordersList);
      // ordersList.filter(order => order.data.order_list)

      console.log('response ', response);

      if (response.status !== 200) {
        console.log(response);
        return;
      }

      const ordersIdList = response.data.order_list.map(
        // .data.order_list
        (order) => order.order_sn
      );

      console.log('ordersIdList ', ordersIdList);

      // return;

      const ordersData = await fetchOrdersDetails(ordersIdList);

      if (ordersData.status !== 200) return;

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

      console.log('ordersDetails: ', ordersDetails);

      const totalValueOrdersWithShipping = ordersDetails.reduce(
        (acc, orders) => {
          const totalOrder = orders.item_list.reduce(
            (sum, item) =>
              sum + item.model_original_price * item.model_quantity_purchased,
            0
          );
          return acc + totalOrder;
        },
        0
      );

      const totalQuantityPurchased = ordersDetails.reduce((acc, order) => {
        const totalOrder = order.item_list.reduce(
          (sum, item) => sum + item.model_quantity_purchased,
          0
        );
        return acc + totalOrder;
      }, 0);

      const totalShopeeCommission = ordersDetails.reduce((_acc, order) => {
        const totalCommission = order.item_list.reduce(
          (sum, item) =>
            sum +
            (Number(item.model_original_price) -
              Number(item.model_discounted_price)) *
              Number(item.model_quantity_purchased),
          0
        );
        return totalCommission;
      }, 0);
      const inputCostPrice = 1000;
      // // const inputGovernmentTaxes = 10;

      // const sellingPrice = Number(item.model_original_price);

      // const sellingPriceWithShopeeFee = Number(
      //     item.model_discounted_price
      // );

      // const shopeeCommission =
      //     sellingPrice - sellingPriceWithShopeeFee;

      // const shipping = Number(
      //     order.actual_shipping_fee || order.estimated_shipping_fee
      // );

      // const totalAmountWithShipping = Number(
      //     item.model_original_price
      // );

      // const quantityPurchased = item.model_quantity_purchased;

      // const orderItemQuantityValue = sellingPrice * quantityPurchased;

      // const orderValue = totalAmountWithShipping * quantityPurchased;

      const totalGovernmentTaxes =
        totalValueOrdersWithShipping * (governmentTaxes / 100);

      // const costPrice = inputCostPrice * quantityPurchased; // tem que ser manual (criar tabela no db para salvar o costPrice e puchar do meu backend)
      const totalCostPrice =
        inputCostPrice * totalQuantityPurchased +
        totalGovernmentTaxes +
        totalShopeeCommission;

      // const totalValueOrders = ordersDetails.reduce((acc, orders) => {
      //     const totalOrder = orders.item_list.reduce(
      //         (sum, item) =>
      //             sum +
      //             (Number(item.model_original_price) -
      //                 Number(totalCostPrice)) *
      //                 item.model_quantity_purchased,
      //         0
      //     );
      //     return acc + totalOrder;
      // }, 0);
      const totalValueOrders = ordersDetails.reduce((acc, orders) => {
        const totalOrder = orders.item_list.reduce(
          (sum, item) =>
            sum +
            Number(item.model_original_price) *
              Number(item.model_quantity_purchased),
          0
        );
        return acc + totalOrder;
      }, 0);

      // const totalCost =
      //     costPrice + totalGovernmentTaxes + shopeeCommission;

      const totalProfit = totalValueOrders - totalCostPrice;

      setTotalGovernmentTaxes(totalGovernmentTaxes);
      setTotalShopeeCommission(totalShopeeCommission);
      setTotalCostPrice(totalCostPrice);
      setTotalProfit(totalProfit);
      // setOrders(ordersDetails);
    } catch (err) {
      console.error('[ ERROR ]: ', err);
    } finally {
      setLoading(false);
    }
  }

  // fetchOrders();
  // }, [orders]);

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
                {/* "UNPAID", "READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "IN_CANCEL", "CANCELLED", "INVOICE_PENDING" */}
                <option value="" disabled>
                  Buscar pedidos
                </option>
                <option value="UNPAID">NÃO PAGO</option>
                <option value="READY_TO_SHIP">PRONTO PARA ENVIO</option>
                <option value="PROCESSED">PROCESSADO</option>
                <option value="SHIPPED">ENVIADO</option>
                <option value="COMPLETED">CONCLUÍDO</option>
                <option value="IN_CANCEL">EM CANCELAMENTO</option>
                <option value="CANCELLED">CANCELADO</option>
                <option value="INVOICE_PENDING">FATURA PENDENTE</option>
              </select>
              <Button onClick={fetchOrders}>Buscar</Button>
              {numberOfOrdersFound} produtos encontrados.
            </div>

            {shop && orders.length > 0 ? (
              <div>
                <div className="text-xl font-bold my-4">
                  Pedidos {`${inputOrderStatus.length} ${inputOrderStatus}`}:
                </div>
              </div>
            ) : (
              <p>
                Você ainda não conectou o ShopTurbo à Shopee. Quando você
                autorizar nosso sistema, os produtos da sua loja aparecerão
                aqui.
              </p>
            )}

            {loading && <IsLoading width="w-[340px]" />}
          </section>

          <section className="max-h-dvh overflow-y-auto rounded-md border border-[--bg_5]">
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
                      <FaRegEdit
                        className="text-xl text-gray-300 hover:text-[--bg_2] hover:cursor-pointer"
                        onClick={handleInputGovernmentTaxes}
                      />
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
                      switch (status) {
                        case 'UNPAID':
                          return 'Aguardando pagamento';

                        case 'READY_TO_SHIP':
                          return 'Pronto para envio';

                        case 'PROCESSED':
                          return 'Processado';

                        case 'SHIPPED':
                          return 'Enviado';

                        case 'COMPLETED':
                          return 'Concluído';

                        case 'IN_CANCEL':
                          return 'Em cancelamento';

                        case 'CANCELLED':
                          return 'Cancelado';

                        case 'INVOICE_PENDING':
                          return 'Fatura pendente';

                        case 'TO_CONFIRM_RECEIVE':
                          return 'Enviado! Aguardando comprador confirmar recebimento';

                        default:
                          return 'Desconhecido';
                      }
                    }

                    const inputCostPrice = 1000;
                    // const inputGovernmentTaxes = 10;

                    const sellingPrice = Number(item.model_original_price);

                    const sellingPriceWithShopeeFee = Number(
                      item.model_discounted_price
                    );

                    const shopeeCommission =
                      sellingPrice - sellingPriceWithShopeeFee;

                    const shipping = Number(
                      order.actual_shipping_fee || order.estimated_shipping_fee
                    );

                    const totalAmountWithShipping = Number(
                      item.model_original_price
                    );

                    const quantityPurchased = item.model_quantity_purchased;

                    const orderItemQuantityValue =
                      sellingPrice * quantityPurchased;

                    const orderValue =
                      totalAmountWithShipping * quantityPurchased;

                    const costPrice = inputCostPrice * quantityPurchased; // tem que ser manual (criar tabela no db para salvar o costPrice e puchar do meu backend)

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
                          <div>
                            {/* <img
                                                                className="w-8 h-8 object-cover rounded"
                                                                src={
                                                                    item.image_url
                                                                }
                                                                alt={
                                                                    item.item_name
                                                                }
                                                            /> */}
                            <div className="flex flex-col justify-between items-start gap-1 text-gray-100 uppercase">
                              <span className="font-medium">
                                {item.item_name}
                              </span>

                              <span className="text-xs text-gray-400">
                                ID produto: {item.item_id}
                              </span>

                              <span className="text-xs text-gray-400 flex justify-start items-center gap-1">
                                <span className="flex justify-start items-center">
                                  SKU: {item.item_sku}
                                </span>
                                <RxCopy className="text-xl text-gray-300 hover:text-[--bg_2] hover:cursor-pointer" />
                              </span>

                              <span className="text-xs text-gray-400 flex justify-start items-center gap-1">
                                <span className="flex justify-start items-center">
                                  ID Venda: {order.order_sn}
                                </span>
                                <RxCopy className="text-xl text-gray-300 hover:text-[--bg_2] hover:cursor-pointer" />
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
                          {sellingPrice.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        {/* Qtd. */}
                        <td className="border border-[--bg_3] p-2 text-gray-300 text-center">
                          x {quantityPurchased}
                        </td>

                        {/* Valor total pedido */}
                        <td className="border border-[--bg_3] p-2 text-blue-400">
                          {orderItemQuantityValue.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        {/* Preço de custo */}
                        <td className="border border-[--bg_3] p-2 text-yellow-300">
                          {inputCostPrice.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                          <FaRegEdit className="inline ml-2 text-gray-300 hover:text-[--bg_2] hover:cursor-pointer" />
                        </td>

                        {/* Imposto */}
                        <td className="border border-[--bg_3] p-2">
                          {governmentTaxes}%
                          <div className="p-2 text-yellow-300">
                            {totalGovernmentTaxes.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </div>
                        </td>

                        {/* Comissão Shopee */}
                        <td className="border border-[--bg_3] p-2 text-yellow-300">
                          {shopeeCommission.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        {/* Frete */}
                        <td className="border border-[--bg_3] p-2">
                          {shipping.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        {/* Total de custos */}
                        <td className="border border-[--bg_3] p-2 text-orange-400">
                          {totalCost.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        {/* Lucro */}
                        <td
                          className={`border border-[--bg_3] p-2 font-bold ${
                            profit >= 0 ? 'text-green-500' : 'text-red-600'
                          }`}
                        >
                          {profit.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                      </tr>
                    );
                  })
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
                      {orders.reduce((acc, order) => {
                        const totalOrder = order.item_list.reduce(
                          (sum, item) => sum + item.model_quantity_purchased,
                          0
                        );
                        return acc + totalOrder;
                      }, 0)}
                    </th>

                    {/* Total vendas */}
                    <th className="py-4 px-2 border border-[--bg_3] text-blue-400">
                      {Number(
                        orders.reduce((acc, orders) => {
                          const totalOrder = orders.item_list.reduce(
                            (sum, item) =>
                              sum +
                              item.model_original_price *
                                item.model_quantity_purchased,
                            0
                          );
                          return acc + totalOrder;
                        }, 0)
                      ).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </th>

                    {/* Total preco custo */}
                    <th className="py-4 px-2 border border-[--bg_3]">***</th>

                    {/* Total impostos */}
                    <th className="py-4 px-2 border border-[--bg_3] text-yellow-300">
                      {/* const totalGovernmentTaxes = totalValueOrdersWithShipping * (governmentTaxes / 100); */}
                      {Number(
                        totalGovernmentTaxes
                        // orders.reduce(
                        //     (acc, order) =>
                        //         acc +
                        //         order.total_amount,
                        //     0
                        // ) *
                        //     (governmentTaxes / 100)
                      ).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </th>

                    {/* Total comissao shopee */}
                    <th className="py-4 px-2 border border-[--bg_3] text-yellow-300">
                      {Number(totalShopeeCommission).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </th>

                    {/* Total frete */}
                    <th className="py-4 px-2 border border-[--bg_3]">
                      ***
                      {/* {Number(
                                                    orders.reduce(
                                                        (acc, order) =>
                                                            acc +
                                                            order.actual_shipping_fee,
                                                        0
                                                    )
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })} */}
                    </th>

                    {/* Total custos pedidos */}
                    <th className="py-4 px-2 border border-[--bg_3] text-orange-400">
                      {Number(totalCostPrice).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </th>

                    {/* Total lucros */}
                    <th className="py-4 px-2 border border-[--bg_3] text-green-400 font-extrabold">
                      {Number(totalProfit).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
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
