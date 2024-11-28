// components/CategoryNav.js
"use client";
import { useState, useEffect} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowBigDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const mainCategories = data.filter((cat) => cat.level === 1);
        setCategories(mainCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setIsMenuOpen(false);
    const params = new URLSearchParams(searchParams);

    if (categoryId) {
      params.set("category", categoryId);
      router.push(`/products?${params.toString()}`);
    } else {
      router.push("/products");
    }
  };

  if (loading) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 rounded-lg bg-gradient-to-b from-black/50 to-transparent">
      <div className="container mx-auto px-4">
        <div className="hidden md:flex justify-center gap-4 py-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="px-4 py-2 text-white hover:text-red-400 transition-colors"
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-start pl-4 gap-2 py-4 text-white"
          >
            {isMenuOpen ? (
              <X size={20} />
            ) : (
              <>
                <ArrowBigDownIcon size={20} />
                <span>Categorías</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 z-30"
                />

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 right-0 bg-white shadow-lg rounded-b-xl overflow-hidden z-40"
                >
                  <div className="max-h-[60vh] overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-b border-gray-100 last:border-none"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
