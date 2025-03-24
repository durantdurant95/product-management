"use client";

import AddProductForm from "@/components/add-product-form";
import { ModeToggle } from "@/components/mode-toggle";
import ProductCard from "@/components/product-card";
import ProductFilters from "@/components/product-filters";
import { fetchProducts } from "@/lib/productsService";
import { Product } from "@/lib/types";
import { ListChecks } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Parse filter parameters with defaults
  const filters = {
    checked: searchParams.get("checked"),
    sortBy: searchParams.get("sortBy") || "updatedAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: Number(searchParams.get("page") || "1"),
  };

  // Load initial products and on filter change
  useEffect(() => {
    const loadInitialProducts = async () => {
      setLoading(true);
      try {
        // Convert string param to boolean or null
        let checkedParam = null;
        if (filters.checked === "true") checkedParam = true;
        if (filters.checked === "false") checkedParam = false;

        const newProducts = await fetchProducts({
          checked: checkedParam,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: 1,
          pageSize: ITEMS_PER_PAGE,
        });
        setProducts(newProducts);
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProducts();
  }, [filters.checked, filters.sortBy, filters.sortOrder]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loaderRef, hasMore, loading]);

  // Function to load more products
  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    setLoading(true);

    try {
      // Convert string param to boolean or null
      let checkedParam = null;
      if (filters.checked === "true") checkedParam = true;
      if (filters.checked === "false") checkedParam = false;

      const newProducts = await fetchProducts({
        checked: checkedParam,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: nextPage,
        pageSize: ITEMS_PER_PAGE,
      });

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen pb-8">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto py-4 lg:py-8 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ProductTracker</span>
          </Link>
          <div className="flex items-center space-x-2">
            <AddProductForm />
            <ModeToggle />
          </div>
        </div>
      </header>

      <section className="container">
        {/* Filters */}
        <ProductFilters currentFilters={filters} />

        {/* Products grid */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Loading indicator */}
        <div ref={loaderRef} className="py-4 text-center">
          {loading && <p>Loading more products...</p>}
          {!hasMore && products.length > 0 && (
            <p className="text-muted-foreground">No more products to load</p>
          )}
        </div>
      </section>
    </main>
  );
}
