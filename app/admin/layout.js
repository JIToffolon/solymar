"use client";
import "../globals.css";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { montserrat, roboto } from "../ui/fonts";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
  },
  {
    title: "Productos",
    path: "/admin/products",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    ),
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    ),
  },
  {
    title: "Órdenes",
    path: "/admin/orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const SidebarContent = useMemo(
    () => (
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map(({ path, icon, title }) => (
            <li key={path}>
              <Link
                href={path}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${
                  pathname === path ? "bg-red-50 text-red-600" : ""
                }`}
              >
                {icon}
                <span className="ml-3">{title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    ),
    [pathname]
  );

  return (
    <div className={`${roboto.className} min-h-screen bg-gray-50`}>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-lg`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <Link href="/admin" className="text-xl font-bold text-red-600">
            Admin Panel
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg>...</svg>
          </button>
        </div>
        {SidebarContent}
      </aside>

      <div
        className={`lg:ml-64 transition-margin ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg>...</svg>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-['Roboto']">
                {session?.user?.email}
              </span>
              <Link
                href="/"
                className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Volver al sitio
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
