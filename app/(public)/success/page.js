'use client';
import { Suspense } from "react";
import SuccessContent from "@/app/components/SuccessContent";
import { Loader } from "lucide-react";


export default function Products() {
  return (
    <Suspense fallback={<Loader/>}>
      <SuccessContent />
    </Suspense>
  );
}