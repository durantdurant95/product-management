"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ProductFiltersProps {
  currentFilters: {
    checked: string | null; // Using string to handle URL param values
    sortBy: string;
    sortOrder: string;
    page: number;
  };
}

export default function ProductFilters({
  currentFilters,
}: ProductFiltersProps) {
  // Use local state to track the current values
  const [filters, setFilters] = useState(currentFilters);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update local state when props change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  // Create a memoized version of updateParams to prevent unnecessary re-renders
  const updateParams = useCallback(
    (params: Record<string, string>) => {
      // Create a new URLSearchParams instance from the current search params
      const newParams = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      // Navigate to the new URL with updated parameters
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-lg">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checked">Status</Label>
        <Select
          key={`checked-${filters.checked}`} // Force re-render on value change
          defaultValue={filters.checked || "all"}
          onValueChange={(value) => {
            console.log(`Setting checked to: ${value}`);
            // Update local state first for immediate UI feedback
            setFilters((prev) => ({ ...prev, checked: value }));
            // Then update URL params
            updateParams({ checked: value });
          }}
        >
          <SelectTrigger id="checked" className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Checked</SelectItem>
            <SelectItem value="false">Unchecked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sortBy">Sort By</Label>
        <Select
          key={`sortBy-${filters.sortBy}`}
          defaultValue={filters.sortBy}
          onValueChange={(value) => {
            setFilters((prev) => ({ ...prev, sortBy: value }));
            updateParams({ sortBy: value });
          }}
        >
          <SelectTrigger id="sortBy" className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="updatedAt">Updated Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Order</Label>
        <Select
          key={`sortOrder-${filters.sortOrder}`}
          defaultValue={filters.sortOrder}
          onValueChange={(value) => {
            setFilters((prev) => ({ ...prev, sortOrder: value }));
            updateParams({ sortOrder: value });
          }}
        >
          <SelectTrigger id="sortOrder" className="w-[180px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end ml-auto">
        <Button
          variant="outline"
          onClick={() => {
            const defaultFilters = {
              checked: "all",
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: "1",
            };
            setFilters({
              checked: "all",
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: 1,
            });
            updateParams(defaultFilters);
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
