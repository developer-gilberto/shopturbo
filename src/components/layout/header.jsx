import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="bg-slate-900 flex justify-between items-center gap-1">
            <Link href="/" className="flex items-center gap-1">
                <Image
                    src="/assets/icons/shopturbo-icons/android-chrome-192x192.png"
                    alt="shopturbo-logo"
                    width={64}
                    height={64}
                    quality={100}
                    className="rounded-full"
                />
                <p className="text-primary_color text-xl font-bold">
                    ShopTurbo
                </p>
                &reg;
            </Link>
        </header>
    );
}
