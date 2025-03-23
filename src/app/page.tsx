import AddProductForm from "@/components/add-product-form";
import { ModeToggle } from "@/components/mode-toggle";
import ProductList from "@/components/product-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProducts } from "@/lib/productsService";

export default async function HomePage() {
  const products = await fetchProducts();

  // const addProduct = (product: Omit<Product, "id" | "checked">) => {
  //   const newProduct = {
  //     ...product,
  //     id: Date.now().toString(),
  //     checked: false,
  //   };
  //   setProducts([...products, newProduct]);
  // };

  // const toggleProductStatus = (id: string) => {
  //   setProducts(
  //     products.map((product) =>
  //       product.id === id ? { ...product, checked: !product.checked } : product
  //     )
  //   );
  // };

  // const deleteProduct = (id: string) => {
  //   setProducts(products.filter((product) => product.id !== id));
  // };

  const uncheckedProducts = products.filter((product) => !product.checked);
  const checkedProducts = products.filter((product) => product.checked);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div className="flex items-center space-x-4">
            <AddProductForm />
            <ModeToggle />
          </div>
        </div>

        <Tabs defaultValue="unchecked" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="unchecked">Unchecked</TabsTrigger>
            <TabsTrigger value="checked">Checked</TabsTrigger>
          </TabsList>
          <TabsContent value="unchecked" className="mt-0">
            <ProductList products={uncheckedProducts} />
          </TabsContent>
          <TabsContent value="checked" className="mt-0">
            <ProductList products={checkedProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
