"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Users, Phone, ArrowRight } from "lucide-react";

const NavigationSection = React.memo(() => {
  const navigationCards = useMemo(
    () => [
      {
        title: "Productos",
        description: "Explora nuestra colección completa",
        icon: ShoppingBag,
        link: "/products",
        color: "from-red-600 to-red-700",
      },
      {
        title: "Sobre Nosotros",
        description: "Conoce nuestra historia",
        icon: Users,
        link: "/about",
        color: "from-red-700 to-red-800",
      },
      {
        title: "Contacto",
        description: "Estamos para ayudarte",
        icon: Phone,
        link: "/contacto",
        color: "from-red-800 to-red-900",
      },
    ],
    []
  );

  return (
    <section className="py-12 md:py-16 lg:py-24 relative -mt-8 md:-mt-12 lg:-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {navigationCards.map((card, index) => (
            <NavigationCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

const NavigationCard = React.memo(({ card, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-xl md:rounded-2xl shadow-xl overflow-hidden group cursor-pointer"
  >
    <Link href={card.link}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <CardContent card={card} />
      <CardOverlays />
    </Link>
  </motion.div>
));

const CardContent = React.memo(({ card }) => (
  <div className="relative h-full p-6 md:p-8 flex flex-col items-center justify-center text-white">
    <card.icon className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500" />
    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-center">
      {card.title}
    </h3>
    <p className="text-base md:text-lg text-center mb-6 md:mb-8 opacity-90 px-2 md:px-0">
      {card.description}
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 bg-white text-red-600 px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base group-hover:bg-opacity-100 transition-all"
    >
      <span>Explorar</span>
      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  </div>
));

const CardOverlays = React.memo(() => (
  <>
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute inset-0 opacity-20 bg-pattern mix-blend-soft-light" />
  </>
));

export default NavigationSection;
