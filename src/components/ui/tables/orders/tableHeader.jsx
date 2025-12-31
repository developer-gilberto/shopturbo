export function TableHeader({ children }) {
  return (
    <thead className="sticky top-0 z-10 bg-[--bg_4] text-gray-400">
      {children}
    </thead>
  );
}
