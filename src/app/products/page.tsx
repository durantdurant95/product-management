import AddProductForm from "@/components/add-product-form";
import { ModeToggle } from "@/components/mode-toggle";
import ProductCard from "@/components/product-card";
import ProductFilters from "@/components/product-filters";
import { fetchProducts } from "@/lib/productsService";
import { ListChecks } from "lucide-react";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  // Parse filter parameters with defaults - ensure all are strings for consistent handling
  const filters = {
    status: searchParams.status || "all",
    sortBy: searchParams.sortBy || "updatedAt",
    sortOrder: searchParams.sortOrder || "desc",
    page: Number(searchParams.page || "1"),
    pageSize: Number(searchParams.pageSize || "10"),
  };

  console.log("Current filters:", filters); // Debug log

  // Fetch products with filtering applied on the backend
  const products = await fetchProducts({
    status: filters.status,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    pageSize: filters.pageSize,
  });

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
        {products.length === 0 ? (
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
      </section>
    </main>
  );
}
