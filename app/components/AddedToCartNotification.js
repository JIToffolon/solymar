import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const AddedToCartNotification = ({ isVisible, productName }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
          <div className="bg-green-100 rounded-full p-1">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-gray-700">
            <span className="font-medium">{productName}</span> fue agregado al carrito
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AddedToCartNotification;