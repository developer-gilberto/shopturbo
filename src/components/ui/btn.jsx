'use client';

export function Button({ onClick, children, value, type, width, customStyle }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex justify-center items-center gap-2
                bg-primary_color text-white text-nowrap px-2 py-1 rounded-md font-extrabold hover:bg-secondary_color
                ${width ? width : ''}
                ${customStyle ? customStyle : ''}
            `}
            type={type}
        >
            {children}
            {value}
        </button>
    );
}
