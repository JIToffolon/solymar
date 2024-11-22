'use client';

import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";

export function withAdminAuth(Component) {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (status === "authenticated") {
        if (session?.user?.role !== "ADMIN") {
          window.location.href = "/";
        } else {
          setIsAuthorized(true);
        }
      }
    }, [session, status, pathname]);

    if (status === "loading" || !isAuthorized) {
      return <div>Cargando...</div>;
    }

    return <Component {...props} />;
  };
}
