import { fetchProducts } from "@/lib/productsService";

export default async function TestPage() {
  const products = await fetchProducts();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
      <p className="text-muted-foreground">
        This is a test page to fetch products from the API.
      </p>
      <p className="text-muted-foreground">Check the console for any errors.</p>
      <p className="text-muted-foreground">Make sure the API is running.</p>
      <div className="mt-8"></div>
      <h2 className="text-xl font-semibold mb-4">Products List</h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id || index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium">
                {product.name || `Product ${index + 1}`}
              </h3>
              {product.description && (
                <p className="text-muted-foreground mt-2 text-sm line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}
