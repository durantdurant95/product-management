"use client";

import AddProductForm, {
  PRODUCT_CREATED_EVENT,
} from "@/components/add-product-form";
import { ModeToggle } from "@/components/mode-toggle";
import ProductCard from "@/components/product-card";
import ProductFilters from "@/components/product-filters";
import { fetchProducts } from "@/lib/productsService";
import { Product } from "@/lib/types";
import { ListChecks, Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 10;

// Create custom events for product operations
export const PRODUCT_DELETED_EVENT = "product-deleted";
export const PRODUCT_STATUS_UPDATED_EVENT = "product-status-updated";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add a refresh trigger state
  const loaderRef = useRef<HTMLDivElement>(null);

  // Parse filter parameters with defaults
  const filters = {
    checked: searchParams.get("checked"),
    sortBy: searchParams.get("sortBy") || "updatedAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: Number(searchParams.get("page") || "1"),
  };

  // Create a memoized refresh function
  const refreshProducts = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Function to load more products - wrapped in useCallback
  const loadMoreProducts = useCallback(async () => {
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
  }, [
    loading,
    hasMore,
    currentPage,
    filters.checked,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Listen for product events
  useEffect(() => {
    const handleProductUpdated = () => {
      refreshProducts();
    };

    window.addEventListener(PRODUCT_DELETED_EVENT, handleProductUpdated);
    window.addEventListener(PRODUCT_STATUS_UPDATED_EVENT, handleProductUpdated);
    window.addEventListener(PRODUCT_CREATED_EVENT, handleProductUpdated);

    return () => {
      window.removeEventListener(PRODUCT_DELETED_EVENT, handleProductUpdated);
      window.removeEventListener(
        PRODUCT_STATUS_UPDATED_EVENT,
        handleProductUpdated
      );
      window.removeEventListener(PRODUCT_CREATED_EVENT, handleProductUpdated);
    };
  }, [refreshProducts]);

  // Load initial products and on filter change or refresh trigger
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
  }, [filters.checked, filters.sortBy, filters.sortOrder, refreshTrigger]); // Add refreshTrigger as dependency

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
  }, [loaderRef, hasMore, loading, loadMoreProducts]);

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
              <ProductCard
                key={product.id}
                product={product}
                onProductDeleted={refreshProducts} // Pass refresh function to ProductCard
              />
            ))}
          </div>
        )}

        {/* Loading indicator */}
        <div ref={loaderRef} className="py-4 text-center flex justify-center">
          {loading && <Loader className="animate-spin" />}
          {!hasMore && products.length > 0 && !loading && (
            <p className="text-muted-foreground">No more products to load</p>
          )}
        </div>
      </section>
    </main>
  );
}
