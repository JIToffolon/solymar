const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    className = "" 
  }) => {
    const renderPageNumbers = () => {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => (
          page === 1 ||
          page === totalPages ||
          Math.abs(currentPage - page) <= 1
        ))
        .map((page, index, array) => {
          if (index > 0 && page - array[index - 1] > 1) {
            return (
              <span key={`ellipsis-${page}`} className="px-4 py-2 text-gray-700">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-gray-700 rounded ${
                currentPage === page
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          );
        });
    };
  
    return totalPages > 1 ? (
      <div className={`flex justify-center gap-2 mt-8 text-gray-700 ${className}`}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-200"
        >
          Anterior
        </button>
        
        {renderPageNumbers()}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-200"
        >
          Siguiente
        </button>
      </div>
    ) : null;
  };
  
  export default Pagination;