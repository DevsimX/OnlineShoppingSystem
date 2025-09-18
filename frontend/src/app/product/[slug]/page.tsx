import AddToCartButton from "./AddToCartButton";
type Category = { name: string; slug: string };
type Product = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price_cents: number;
  images: { image_url: string; alt_text: string }[];
  category: Category;
};

async function fetchJSON<T>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const res = await fetch(`${base}/api/${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch " + path);
  return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  const product = await fetchJSON<Product>(`products/${slug}/`);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
          <img src={product.images?.[0]?.image_url} alt={product.images?.[0]?.alt_text || product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 text-xl">${(product.price_cents / 100).toFixed(2)}</div>
          {product.short_description && <p className="mt-4 text-gray-700">{product.short_description}</p>}
          {product.description && <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: product.description }} />}
          <div className="mt-6">
            <AddToCartButton productSlug={product.slug} />
          </div>
        </div>
      </div>
    </main>
  );
}


