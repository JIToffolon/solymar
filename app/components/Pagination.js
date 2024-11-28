const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const handlePageChange = (page) => {
    // Intentar diferentes métodos de scroll
    try {
      // Método 1: Scroll al inicio de la página
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Método 2: Scroll al elemento más arriba
      document.body.scrollIntoView({ behavior: "smooth" });

      // Método 3: Scroll forzado
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } catch (error) {
      // Si falla, usar el método más básico
      window.scrollTo(0, 0);
    }

    onPageChange(page);
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(
        (page) =>
          page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1
      )
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
            onClick={() => handlePageChange(page)} // Aquí está el cambio
            className={`px-4 py-2 text-gray-700 rounded ${
              currentPage === page
                ? "bg-red-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      });
  };

  return totalPages > 1 ? (
    <div
      className={`flex justify-center gap-2 mt-8 text-gray-700 ${className}`}
    >
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-200"
      >
        Anterior
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-100 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-200"
      >
        Siguiente
      </button>
    </div>
  ) : null;
};

export default Pagination;
