import Image from "next/image";

export function Logo({ width, height }) {
    return (
        <Image
            src="/assets/icons/shopturbo-icons/android-chrome-512x512.png"
            alt="ShopTurbo"
            width={width}
            height={height}
            quality={100}
            className="rounded-full"
        />
    );
}
