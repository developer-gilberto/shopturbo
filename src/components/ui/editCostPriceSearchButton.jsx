'use client';

import { useProducts } from '@/context/productContext';
import { FaRegEdit } from 'react-icons/fa';

export function EditCostPriceSearchButton({ editedProductId, fromShopturbo }) {
  const { productsFound, setHasEditedProduct, setProductsFound } =
    useProducts();

  function handleInputCostPrice() {
    const inputCostPrice = prompt(
      'Digite o preço de custo (para números com vírgula, digite ponto no lugar da vírgula): ',
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

    const inputTaxes = prompt('Digite o valor do imposto %: ');

    if (inputTaxes === null) return;

    if (inputTaxes.trim() === '') {
      alert('⚠️ Você não digitou nada!');
      return;
    }

    const governmentTaxes = Number(inputTaxes);

    if (Number.isNaN(governmentTaxes)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }

    const newProductFound = productsFound.map((product) =>
      String(product.item_id) === String(editedProductId)
        ? {
            ...product,
            costPrice: costPrice,
            governmentTaxes: governmentTaxes,
            edited_product: true,
          }
        : product,
    );

    setProductsFound(newProductFound);
    setHasEditedProduct(true);
  }

  return (
    <FaRegEdit
      className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
      onClick={handleInputCostPrice}
    />
  );
}
