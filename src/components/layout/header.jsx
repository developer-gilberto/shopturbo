import Link from "next/link";
import { Logo } from "../ui/logo";

export function Header() {
    return (
        <header className="flex justify-between items-center gap-2 p-2 border-b-[1px] border-[--bg_4]">

            <Link href="/" className="flex items-center gap-1">
                <Logo width={48} height={48} />
                <strong className="text-primary_color text-xl font-bold">
                    ShopTurbo
                </strong>
                &reg;
            </Link>

            <div className="flex justify-between items-center gap-4">
                <Link href="/signup" className="flex items-center gap-1">
                    /signup
                </Link>
                <Link href="/login" className="flex items-center gap-1">
                    /login
                </Link>
                <Link href="/dashboard" className="flex items-center gap-1">
                    /dashboard
                </Link>
            </div>

        </header>
    );
}
