
export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex items-center justify-between border p-4 rounded">
      <div>
        <h3 className="font-medium">{item.product.name}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-900 font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}