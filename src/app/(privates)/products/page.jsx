import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';
import { ProductsTable } from '@/components/ui/tables/products/productsTable';
import { ProductSearch } from '@/components/ui/productSearch';

export default function Products() {
  return (
    <section className="w-full min-h-screen flex">
      <Nav />
      <Main>
        <>
          <ProductSearch />

          <div className="max-h-dvh overflow-y-auto rounded-md">
            <ProductsTable />
          </div>
        </>
      </Main>
    </section>
  );
}
