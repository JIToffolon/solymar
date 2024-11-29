import FailureContent from "@/app/components/FailureContent";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default function Failure() {
  

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <Suspense fallback={<Loader/>}>
        <FailureContent/>
      </Suspense>
    </div>
  );
}