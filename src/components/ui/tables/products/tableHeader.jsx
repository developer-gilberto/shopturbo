export function TableHeader() {
    return (
        <thead className="sticky top-0 z-10 bg-[--bg_3] text-gray-300">
            <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">ID</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Estoque</th>
                <th className="p-3">Preço de Venda</th>
                <th className="p-3">Preço de Custo</th>
                <th className="p-3">Imposto %</th>
            </tr>
        </thead>
    );
}
