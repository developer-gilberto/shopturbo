import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";

export default function Dashboard() {
    return (
        <>
            <section className=" w-full min-h-screen flex">
                <Nav />
                <Main>
                    Dashboard
                </Main>
            </section>
        </>
    );
}
