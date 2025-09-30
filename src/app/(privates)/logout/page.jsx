import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";

export default function Logout() {
    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <Main>
                    Se você sair, será necessário fazer login novamente para ter
                    acesso ao Shopturbo. Tem certeza que deseja sair?
                </Main>
            </section>
        </>
    );
}
