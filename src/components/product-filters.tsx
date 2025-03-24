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
    status: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    pageSize: number;
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
        <Label htmlFor="status">Status</Label>
        <Select
          key={`status-${filters.status}`} // Force re-render on value change
          defaultValue={filters.status}
          onValueChange={(value) => {
            console.log(`Setting status to: ${value}`);
            // Update local state first for immediate UI feedback
            setFilters((prev) => ({ ...prev, status: value }));
            // Then update URL params
            updateParams({ status: value });
          }}
        >
          <SelectTrigger id="status" className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="checked">Checked</SelectItem>
            <SelectItem value="unchecked">Unchecked</SelectItem>
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pageSize">Items Per Page</Label>
        <Select
          key={`pageSize-${filters.pageSize}`}
          defaultValue={filters.pageSize.toString()}
          onValueChange={(value) => {
            setFilters((prev) => ({ ...prev, pageSize: Number(value) }));
            updateParams({ pageSize: value });
          }}
        >
          <SelectTrigger id="pageSize" className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end ml-auto">
        <Button
          variant="outline"
          onClick={() => {
            const defaultFilters = {
              status: "all",
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: "1",
              pageSize: "10",
            };
            setFilters({
              status: "all",
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: 1,
              pageSize: 10,
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
