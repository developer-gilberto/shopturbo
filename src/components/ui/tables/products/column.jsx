export function Column({ children }) {
    return (
        <td className="p-3 text-gray-300 border border-[--bg_3]">
            <div className="flex justify-center items-center gap-2 text-gray-100">{children}</div>
        </td>
    );
}
