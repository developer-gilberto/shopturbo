import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-slate-800">
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
        </footer>
    );
}
