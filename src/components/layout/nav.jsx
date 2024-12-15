import Link from "next/link";

export function Nav() {
    return (
        <nav className="border border-[--bg_4] min-w-fit p-2">
            <ul className="flex flex-col gap-4 p-2">
                <li className="flex rounded-md">
                    <Link
                        href="#"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Conta do Usuário
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/dashboard"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/products"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Produtos
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/commission"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Comissão
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/profit"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Lucro
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/taxes"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Impostos %
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/generate-url"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:bg-[--bg_5] hover:border-[--bg_3] hover:cursor-pointer"
                    >
                        Conectar à Shopee
                    </Link>
                </li>
                <li className="flex rounded-md">
                    <Link
                        href="/logout"
                        className="min-w-full bg-[--bg_4] py-1 px-2 rounded-md border-[1px] border-transparent hover:border-red-600 hover:text-red-500 hover:cursor-pointer font-extrabold"
                    >
                        Sair
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
