"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RefreshCw, TrendingUp } from 'lucide-react';
const features = [
    {
      icon: Truck,
      title: "Envío Express",
      desc: "Entregas en 24-48hs",
    },
    {
      icon: ShieldCheck,
      title: "Compra Segura",
      desc: "100% Garantizado",
    },
    {
      icon: RefreshCw,
      title: "Cambios Gratis", 
      desc: "30 días de prueba",
    },
    {
      icon: TrendingUp,
      title: "Mejores Precios",
      desc: "Garantía de precio",
    },
  ];
  
  const FeaturesSection = React.memo(() => (
    <section className="py-20 bg-white text-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  ));
  
  const FeatureCard = React.memo(({ feature, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group p-6 rounded-2xl hover:bg-gray-200 transition-colors text-center flex flex-col items-center justify-center cursor-pointer"
    >
      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
        <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-lg font-bold mb-2 font-['Roboto']">{feature.title}</h3>
      <p className="text-gray-600">{feature.desc}</p>
    </motion.div>
  ));
  
  export default FeaturesSection;