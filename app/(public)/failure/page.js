// "use client";
// import { Suspense, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function Failure() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     if (!searchParams.get("payment_id")) {
//       router.push("/");
//     }
//   }, [searchParams, router]);

//   return (
//     <div className="max-w-2xl mx-auto p-8 text-center">
//       <Suspense>
//         <div className="bg-red-50 rounded-lg p-8 mb-6">
//           <svg
//             className="w-16 h-16 text-red-500 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//           <h1 className="text-2xl font-bold text-red-700 mb-4">
//             Error en el pago
//           </h1>
//           <p className="text-red-600 mb-4">
//             Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
//           </p>
//           <p className="text-sm text-red-500">
//             ID de pago: {searchParams.get("payment_id")}
//           </p>
//         </div>
//       </Suspense>

//       <Link
//         href="/checkout"
//         className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
//       >
//         Intentar nuevamente
//       </Link>
//     </div>
//   );
// }
"use client";
import FailureContent from "@/app/components/FailureContent";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
export default function Failure() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <Suspense fallback={<div>Cargando...</div>}>
        <FailureContent router={router} />
      </Suspense>
    </div>
  );
}
