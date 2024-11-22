import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

const AddToCartButton2 = ({ onClick, isLoading, isAdded, showText = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={isLoading}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors disabled:bg-gray-300 flex items-center gap-2"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : isAdded ? (
          <>
            <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
          </>
        )}
      </button>
      
      {showTooltip}
    </div>
  );
};

export default AddToCartButton2;