function HeaderSkeleton() {
  return (
    <header className="animate-pulse bg-gray-100 p-4 flex items-center justify-between gap-6 px-6">
      {/* Logo placeholder */}
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

      {/* Navigation items placeholders */}
      <div className="hidden md:flex space-x-4">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
        <div className="w-28 h-4 bg-gray-300 rounded"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
        <div className="w-28 h-4 bg-gray-300 rounded"></div>
      </div>

      {/* User icon placeholder */}
      <div className="w-8 h-8 bg-gray-300 rounded-full ml-auto"></div>
    </header>
  );
}

export default HeaderSkeleton;
