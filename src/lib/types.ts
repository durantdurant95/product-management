export interface Product {
  id: string;
  name: string;
  description: string;
  status: "unchecked" | "checked";
  createdAt: string;
  updatedAt: string;
}
