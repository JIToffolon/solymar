import { Suspense } from "react";
import { Loader } from "lucide-react";
import SuccessContent from "@/app/components/SuccessContent";

export default function Pending() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <Suspense fallback={<Loader />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
