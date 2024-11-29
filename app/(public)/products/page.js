"use client";
import { Suspense } from "react";
import ProductsContent from "@/app/components/ProductsContent";
import { Loader } from "lucide-react";

export default function Products() {
  return (
    <Suspense fallback={<Loader/>}>
      <ProductsContent />
    </Suspense>
  );
}