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

        </header>
    );
}
