import Image from 'next/image';

export function ProductImage(props) {
    return (
        <Image
            src={props.url ? props.url : '/assets/icons/shopturbo-icons/android-chrome-192x192.png'}
            alt={props.name ? props.name : 'imagem produto'}
            width={props.width}
            height={props.height}
            quality={80}
            className="w-16 h-16 object-cover rounded-md"
        />
    );
}
