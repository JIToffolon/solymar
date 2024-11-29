import PendingContent from "@/app/components/PendingContent";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default function Pending() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <Suspense fallback={<Loader />}>
        <PendingContent />
      </Suspense>
    </div>
  );
}
