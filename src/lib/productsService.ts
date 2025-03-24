// This file contains functions to interact with a product API.
// It includes functions to fetch all products, fetch a product by ID, create a new product,
// update an existing product, and delete a product by ID.
"use server";
import { revalidatePath } from "next/cache";
import { Product } from "./types";

const API_URL = "https://67e07e477635238f9aadaa54.mockapi.io/api/v1/products";
if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

/**
 * Fetch products from the API with filtering and sorting options.
 * @param {Object} options - Filtering and pagination options
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
export const fetchProducts = async ({
  page = 1,
  pageSize = 10,
  status = "all",
  sortBy = "updatedAt",
  sortOrder = "desc",
}: {
  page?: number;
  pageSize?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<Product[]> => {
  // Build query parameters
  const params = new URLSearchParams();

  // Add pagination
  params.append("page", page.toString());
  params.append("limit", pageSize.toString());

  // Add sorting (MockAPI uses sortBy and order parameters)
  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("order", sortOrder);
  }

  // Some Mock APIs use filter parameter instead of direct parameter name
  // Try both ways to filter by status
  if (status !== "all") {
    // Try direct status parameter
    params.append("status", status);
    // Also try filter syntax that some APIs use
    params.append("filter", `status=${status}`);
  }

  console.log(`API Request: ${API_URL}?${params.toString()}`);

  // Make the API request with query parameters
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await response.json();

  // Fallback: If we still get all products when filtering,
  // perform client-side filtering
  if (status !== "all" && products.length > 0) {
    return products.filter(
      (product: { status: string }) => product.status === status
    );
  }

  return products;
};

/**
 * Fetch a single product by ID.
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Product>} A promise that resolves to the product object.
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }
  return response.json();
};

/**
 * Create a new product.
 * @param {Product} product - The product data to create.
 * @returns {Promise<Product>} A promise that resolves to the created product.
 */
export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  revalidatePath("/");
  return response.json();
};

/**
 * Update the status of an existing product by ID.
 * @param {string} id - The ID of the product to update status for.
 * @param {boolean} checked - Whether the product is checked or not.
 * @returns {Promise<Product>} A promise that resolves to the updated product.
 */
export const updateProductStatus = async (
  id: string,
  checked: boolean
): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: checked ? "checked" : "unchecked",
      updatedAt: new Date(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update status for product with ID: ${id}`);
  }
  revalidatePath("/");
  return response.json();
};

/**
 * Delete a product by ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<void>} A promise that resolves when the product is deleted.
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete product with ID: ${id}`);
  }
  revalidatePath("/");
  return response.json();
};
