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
import {
  PRODUCT_DELETED_EVENT,
  PRODUCT_STATUS_UPDATED_EVENT,
} from "@/lib/events";
import { deleteProduct, updateProductStatus } from "@/lib/productsService";
import type { Product } from "@/lib/types";
import { Check, Loader, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Update the component props to include onProductDeleted
interface ProductCardProps {
  product: Product;
  onProductDeleted?: () => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      toast.promise(deleteProduct(product.id), {
        loading: "Deleting product...",
        success: () => {
          // Simplified refresh - using only one method
          window.dispatchEvent(new Event(PRODUCT_DELETED_EVENT));
          setIsDeleting(false);
          return `Product "${product.name}" has been deleted`;
        },
        error: (error) => {
          setIsDeleting(false);
          console.error("Error deleting product:", error);
          return "Error deleting product";
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const newStatus = !product.checked;
      const statusText = newStatus ? "checked" : "unchecked";

      setIsUpdating(true);
      toast.promise(updateProductStatus(product.id, newStatus), {
        loading: "Updating product status...",
        success: () => {
          // Simplified refresh - using only one method
          window.dispatchEvent(new Event(PRODUCT_STATUS_UPDATED_EVENT));
          setIsUpdating(false);
          return `Product "${product.name}" has been marked as ${statusText}`;
        },
        error: (error) => {
          setIsUpdating(false);
          console.error("Error updating product status:", error);
          return "Error updating product status";
        },
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      setIsUpdating(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="py-2">{product.name}</CardTitle>
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
          type="button"
          className="transition-all duration-200"
          onClick={handleStatusUpdate}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : product.checked ? (
            "Uncheck"
          ) : (
            "Check"
          )}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          type="button"
          className="h-8 w-8 transition-all duration-200"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
        >
          {isDeleting ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
