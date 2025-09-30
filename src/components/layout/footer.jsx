import Link from "next/link";
import { Logo } from "../ui/logo";

export function Footer() {
    return (
        <footer className="flex justify-center items-center gap-4 p-2 border-t-[1px] border-[--bg_4]">
            <Link href="/" className="flex items-center gap-1">
                <Logo width={48} height={48} />
                <strong className="text-primary_color text-xl font-bold">
                    ShopTurbo
                </strong>
                &reg;
            </Link>
            |
            <div className="flex justify-between items-center gap-4">
                <Link
                    href="/terms"
                    className="flex items-center gap-1 hover:underline"
                >
                    Termos de uso
                </Link>
                <Link
                    href="/#"
                    className="flex items-center gap-1 hover:underline"
                >
                    Assinatura
                </Link>
                <Link
                    href="/#"
                    className="flex items-center gap-1 hover:underline"
                >
                    FAQ
                </Link>
            </div>
        </footer>
    );
}
