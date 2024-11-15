"use client";
import React, { useState } from 'react';
import { Phone, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  const phoneNumber = "5491136791431"; // Tu número
  const message = "¡Hola! Me gustaría hacer una consulta.";

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Función para manejar cuando el mouse entra/sale del área completa
  const handleTooltipVisibility = (show) => {
    if (!show && !isTooltipHovered) {
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-full right-0 mb-4 bg-white rounded-lg shadow-lg p-4 w-72"
              onMouseEnter={() => setIsTooltipHovered(true)}
              onMouseLeave={() => {
                setIsTooltipHovered(false);
                setShowTooltip(false);
              }}
            >
              <button
                onClick={() => {
                  setShowTooltip(false);
                  setIsTooltipHovered(false);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
              <div className="mb-3">
                <h4 className="font-bold text-gray-800 mb-1">¿Necesitas ayuda?</h4>
                <p className="text-sm text-gray-600">
                  Chateá con nosotros por WhatsApp y te responderemos a la brevedad.
                </p>
              </div>
              
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">Mensaje predeterminado:</span>
                  <button
                    onClick={copyMessage}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    title="Copiar mensaje"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 italic">{message}</p>
                {showCopied && (
                  <span className="text-xs text-green-600 mt-1 block">
                    ¡Mensaje copiado!
                  </span>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 border-t mt-3 pt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Normalmente respondemos en menos de 1 hora</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
          whileHover={{ scale: 1.1 }}
          onMouseEnter={() => handleTooltipVisibility(true)}
          onMouseLeave={() => handleTooltipVisibility(false)}
        >
          <div className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors">
            <Phone size={28} />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-25"></div>
        </motion.a>
      </div>
    </>
  );
};

export default WhatsAppButton;