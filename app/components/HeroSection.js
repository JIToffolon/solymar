// components/HeroSection.jsx
"use client";
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

const ProductInfo = React.memo(({ product }) => (
 <div className="h-[25%] p-8 flex flex-col justify-between">
   <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
   <div className="flex justify-between items-center">
     <span className="text-3xl font-bold text-red-600">
       ${Number(product.price).toFixed(2)}
     </span>
     <button className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors transform hover:scale-105">
       <ShoppingBag size={24} />
     </button>
   </div>
 </div>
));

const CarouselControls = ({ length, activeIndex, onNext, onPrev }) => (
 <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
   <button
     onClick={onPrev}
     className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
   >
     <ArrowLeft className="w-6 h-6 text-white" />
   </button>
   <div className="flex gap-3">
     {Array.from({ length }).map((_, idx) => (
       <button
         key={idx}
         onClick={() => setActiveProductIndex(idx)}
         className={`w-3 h-3 rounded-full transition-colors ${
           activeIndex === idx ? "bg-white" : "bg-white/50"
         }`}
       />
     ))}
   </div>
   <button
     onClick={onNext}
     className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
   >
     <ArrowRight className="w-6 h-6 text-white" />
   </button>
 </div>
);

const HeroContent = React.memo(() => (
 <div className="col-span-5">
   <motion.div
     initial={{ opacity: 0, y: 30 }}
     animate={{ opacity: 1, y: 0 }}
     className="text-white"
   >
     <h2 className="text-xl mb-4 font-['Roboto']">Temporada 2024</h2>
     <h1 className="text-6xl font-bold mb-6">SOLYMAR</h1>
     <p className="text-xl mb-8 opacity-90">Descubrí las últimas tendencias</p>
     <button className="bg-white text-red-600 px-10 py-4 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
       Explorar Ahora
     </button>
   </motion.div>
 </div>
));

const CarouselItem = React.memo(({ product }) => (
 <motion.div
   initial={{ opacity: 0, x: 50 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -50 }}
   transition={{ duration: 0.5 }}
   className="absolute inset-0 cursor-pointer"
 >
   <div className="bg-white rounded-xl h-[600px] shadow-xl overflow-hidden">
     <div className="relative h-[75%]">
       <Image
         src={product.imageUrl || "/api/placeholder/800/1000"}
         alt={product.name}
         width={800}
         height={1000}
         priority={true}
         className="w-full h-full object-contain"
       />
       {product.category && (
         <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
           {product.category}
         </div>
       )}
     </div>
     <ProductInfo product={product} />
   </div>
 </motion.div>
));

const ProductCarousel = React.memo(({ products, activeIndex, onNext, onPrev }) => (
 <div className="col-span-7">
   <div className="relative">
     <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
       <div className="relative h-[600px]">
         <AnimatePresence mode="sync">
           {products.map((product, idx) => (
             activeIndex === idx && (
               <CarouselItem key={product.id} product={product} />
             )
           ))}
         </AnimatePresence>
       </div>
       <CarouselControls 
         length={products.length}
         activeIndex={activeIndex}
         onNext={onNext}
         onPrev={onPrev}
       />
     </div>
   </div>
 </div>
));

const HeroSection = ({ featuredProducts, activeIndex, onNext, onPrev, loading, error, onRetry }) => {
 return (
   <section className="relative h-[800px] bg-gradient-to-r from-red-600 to-red-800 rounded-xl">
     <div className="absolute inset-0 flex items-center w-full">
       <div className="container mx-auto px-4">
         <div className="grid grid-cols-12 gap-8 items-center">
           <HeroContent />
           {loading ? (
             <div className="col-span-7 h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
               <Loader className="w-8 h-8 animate-spin text-white" />
             </div>
           ) : error ? (
             <div className="col-span-7 h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
               <div className="text-center text-white">
                 <p className="mb-4">{error}</p>
                 <button onClick={onRetry} className="bg-white text-red-600 px-6 py-2 rounded-full">
                   Reintentar
                 </button>
               </div>
             </div>
           ) : (
             <ProductCarousel 
               products={featuredProducts}
               activeIndex={activeIndex}
               onNext={onNext}
               onPrev={onPrev}
             />
           )}
         </div>
       </div>
     </div>
   </section>
 );
};

export default HeroSection;