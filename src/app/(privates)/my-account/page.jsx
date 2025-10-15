import { Main } from '@/components/layout/main';
import { Nav } from '@/components/layout/nav';

export default function MyAccount() {
    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <Main>Minha conta</Main>
            </section>
        </>
    );
}
