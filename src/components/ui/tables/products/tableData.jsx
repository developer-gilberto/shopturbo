export function TableData({ children, customStyle }) {
    return (
        <div
            className={`flex justify-center items-center gap-2 text-md text-gray-300 ${customStyle && customStyle}`}
        >
            {children}
        </div>
    );
}
