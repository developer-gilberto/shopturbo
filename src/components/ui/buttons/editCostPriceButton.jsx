'use client';

import { useProducts } from '@/context/productContext';
import { FaRegEdit } from 'react-icons/fa';

export function EditCostPriceButton({ editedProductId, fromShopturbo }) {
    const {
        productsShopee,
        productsShopturbo,
        hasEditedProduct,
        setProductsShopee,
        setProductsShopturbo,
        setHasEditedProduct,
    } = useProducts();

    function handleInputCostPrice() {
        const inputCostPrice = prompt(
            'Digite o preço de custo - Digite "." (ponto) no lugar da vírgula -> Ex.: 4.99 ',
            '4.99',
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

        if (fromShopturbo) {
            const newProductsShopturbo = productsShopturbo.map((product) =>
                String(product.id) === String(editedProductId)
                    ? {
                          ...product,
                          costPrice: costPrice,
                          edited_product: true,
                      }
                    : product,
            );

            setProductsShopturbo(newProductsShopturbo);
            setHasEditedProduct(true);
            return;
        }

        const newProductsShopee = productsShopee.map((product) =>
            String(product.item_id) === String(editedProductId)
                ? {
                      ...product,
                      item_cost_price: costPrice,
                      edited_product: true,
                  }
                : product,
        );

        setProductsShopee(newProductsShopee);
        setHasEditedProduct(true);
    }

    return (
        <FaRegEdit
            className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
            onClick={handleInputCostPrice}
        />
    );
}
