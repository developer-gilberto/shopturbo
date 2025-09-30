import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function Terms() {
    return (
        <>
            <section className="w-full h-dvh flex flex-col justify-evenly items-center gap-10">
                <Logo width={75} height={75} />
                <h1 className="text-primary_color text-5xl font-extrabold">
                    ShopTurbo
                </h1>
                <p>Termos de uso</p>
                <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-400"
                >
                    &lt;-Voltar para criação de conta
                </Link>
            </section>
        </>
    );
}
