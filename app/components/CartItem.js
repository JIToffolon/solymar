export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 sm:p-4 rounded">
      <div className="mb-3 sm:mb-0">
        <h3 className="text-sm sm:text-base font-medium">
          {item.product.name}
        </h3>
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() =>
              onQuantityChange(item.id, Math.max(0, item.quantity - 1))
            }
            className="p-1 sm:px-2 sm:py-1 bg-gray-200 rounded text-sm sm:text-base"
          >
            -
          </button>
          <span className="text-sm sm:text-base">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 sm:px-2 sm:py-1 bg-gray-200 rounded text-sm sm:text-base"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end space-x-4">
        <span className="text-gray-900 font-medium text-sm sm:text-base">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 text-sm sm:text-base"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
