const SkeletonLoader = ({ type = 'product' }) => {
  if (type === 'product') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return <div className="h-4 bg-gray-200 rounded animate-pulse"></div>;
};

export default SkeletonLoader;