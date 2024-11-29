import { Suspense } from "react";
import { Loader } from "lucide-react";
import ProductsContent from "@/app/components/ProductsContent";

export default function Products() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
