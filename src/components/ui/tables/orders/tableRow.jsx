export function TableRow({ key, children }) {
  return (
    <tr key={key} className="border-gray-200">
      {children}
    </tr>
  );
}
