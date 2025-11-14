import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { ProductsTable } from '@/components/ui/tables/products/productsTable';

export default function Products() {
  return (
    <section className="w-full min-h-screen flex">
      <Nav />
      <Main>
        <p>
          Quer ver um produto específico? Busque pelo ID do produto para uma
          busca exata ou busque pelo nome do produto para ver todos produtos que
          contém o nome buscado.
        </p>
        <form className="flex justify-start items-center gap-2 my-4">
          <input
            className="bg-[--bg_4] p-1"
            type="search"
            placeholder="Digite o ID do produto"
          />
          <button className="bg-[--bg_3] p-1 rounded-sm">Buscar produto</button>
        </form>
        <section className="max-h-dvh overflow-y-auto rounded-md">
          <ProductsTable />
        </section>
      </Main>
    </section>
  );
}
