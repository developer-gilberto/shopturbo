import Link from "next/link";

export default function notFound() {
    return (
        <section className="h-dvh flex flex-col justify-center items-center gap-4 bg-black text-xl font-extrabold">
            404 - Página não encontrada!
            <Link href="/dashboard" className="text-blue-700 underline text-sm hover:text-blue-500">
                Ir para dashboard
            </Link>
        </section>
    );
}
