"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Phone,
  Mail,
  ArrowRight,
  MessageCircle,
  Clock,
  MapPin,
} from "lucide-react";

const ContactPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("whatsapp");
  const phoneNumber = "5491136791431"; // Tu número
  const message = "¡Hola! Me gustaría hacer una consulta.";

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  const contactMethods = [
    {
      id: "whatsapp",
      icon: Phone,
      title: "WhatsApp",
      description: "Respuesta inmediata",
      info: "+54 11 3679-1431",
      preferred: true,
      link: whatsappUrl, 
      available: "9:00 - 18:00",
      color: "bg-green-500",
    },
    {
      id: "phone",
      icon: PhoneCall,
      title: "Teléfono",
      description: "Línea directa",
      info: "(011)4742-4818",
      link: "tel:+541145678900",
      available: "9:00 - 18:00",
      color: "bg-blue-500",
    },
    {
      id: "email",
      icon: Mail,
      title: "Email",
      description: "Consultas detalladas",
      info: "info@solymar.com",
      link: "mailto:info@solymar.com",
      available: "24/7",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-70 text-gray-700 py-16 font-['Montserrat']">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-['Roboto']"
          >
            Contactanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Estamos acá para ayudarte. Elegí el método que
            prefieras y nos ponemos en contacto con vos, lo antes posible.
          </motion.p>
        </div>

        {/* Métodos de contacto */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16 cursor-pointer">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                selectedMethod === method.id ? "ring-2 ring-red-500 " : ""
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`${method.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
                >
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-['Roboto']">
                  {method.title}
                  {method.preferred && (
                    <span className="ml-2 text-sm font-normal text-red-500">
                      (Recomendado)
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{method.available}</span>
                </div>
                <div className="font-medium text-lg mb-6">{method.info}</div>
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
                >
                  Contactar
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 max-w-5xl mx-auto shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-['Roboto']">
                ¿Por qué preferimos WhatsApp?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Respuesta inmediata</span>
                    <p className="text-gray-600">
                      Te respondemos al instante durante nuestro horario de
                      atención
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Horario extendido</span>
                    <p className="text-gray-600">
                      Mayor disponibilidad para atender tus consultas
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">
                      Seguimiento personalizado
                    </span>
                    <p className="text-gray-600">
                      Mantenemos un historial de tu consulta para brindarte
                      mejor atención
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 font-['Roboto']">
                Horarios de atención
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lunes a Viernes</span>
                  <span className="text-gray-600">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sábados</span>
                  <span className="text-gray-600">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Domingos</span>
                  <span className="text-gray-600">Cerrado</span>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    * Los tiempos de respuesta pueden variar según el volumen de
                    consultas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
