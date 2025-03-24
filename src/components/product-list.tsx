import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";
import { PackageSearch } from "lucide-react";

type ProductListProps = {
  products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/20">
        <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">No products checked</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
