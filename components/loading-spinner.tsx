export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury-light border-t-luxury-gold" />
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="bg-gray-200 h-4 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
            <div className="bg-gray-200 h-6 rounded w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
