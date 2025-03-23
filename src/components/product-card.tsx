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
import type { Product } from "@/lib/types";
import { Check, Trash } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onToggleStatus: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductCard({
  product,
  onToggleStatus,
  onDeleteProduct,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          {product.checked && (
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="h-3 w-3 mr-1" /> Checked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button
          variant={product.checked ? "outline" : "default"}
          size="sm"
          onClick={() => onToggleStatus(product.id)}
          className="transition-all duration-200"
        >
          {product.checked ? "Uncheck" : "Check"}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDeleteProduct(product.id)}
          className="h-8 w-8 transition-all duration-200"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
