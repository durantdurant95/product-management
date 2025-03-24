"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteProduct, updateProductStatus } from "@/lib/productsService";
import type { Product } from "@/lib/types";
import { Check, Trash } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          {product.checked && (
            <Badge variant="default" className="rounded-full w-8 h-8">
              <Check className="h-6 w-6" />
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground">
          {" "}
          {product.description && product.description.length > 50
            ? `${product.description.substring(0, 50)}...`
            : product.description}
        </p>
        <div className="mt-12 flex w-full justify-between">
          <p className="text-xs text-muted-foreground">
            Created:{" "}
            {new Intl.DateTimeFormat("default", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(product.createdAt))}
          </p>
          <p className="text-xs text-muted-foreground">
            Updated:{" "}
            {new Intl.DateTimeFormat("default", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(product.updatedAt))}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button
          variant={product.checked ? "outline" : "default"}
          size="sm"
          type="submit"
          className="transition-all duration-200"
          onClick={() => updateProductStatus(product.id, !product.checked)}
        >
          {product.checked ? "Uncheck" : "Check"}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          type="submit"
          className="h-8 w-8 transition-all duration-200"
          onClick={() => deleteProduct(product.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
