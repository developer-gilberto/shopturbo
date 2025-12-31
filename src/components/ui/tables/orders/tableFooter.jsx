export function TableFooter({ children }) {
  return (
    <tfoot className="sticky bottom-0 z-10 bg-[--bg_4] text-gray-400">
      {children}
    </tfoot>
  );
}
