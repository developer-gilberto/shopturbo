"use client";

export function Button({ children, value, type, width, customStyle }) {
    return (
        <button
            className={`flex justify-center items-center gap-2 ${
                width ? width : ""
            } ${
                customStyle ? customStyle : ""
            } bg-primary_color text-white text-nowrap px-2 py-1 rounded-md font-extrabold hover:bg-secondary_color`}
            type={type}
        >
            {children}
            {value}
        </button>
    );
}
