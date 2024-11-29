'use client';
import { Suspense } from "react";
import PendingContent from "@/app/components/PendingContent";
import { Loader } from "lucide-react";

export default function Pending() {
  return (
    <Suspense fallback={<Loader />}>
      <PendingContent />
    </Suspense>
  );
}