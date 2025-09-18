type Category = { name: string; slug: string; description: string; image_url: string };
type Product = { name: string; slug: string; short_description: string; price_cents: number; images: { image_url: string }[] };

async function fetchJSON<T>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const res = await fetch(`${base}/api/${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch " + path);
  return res.json();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  const [category, productsResp] = await Promise.all([
    fetchJSON<Category>(`categories/${slug}/`),
    fetchJSON<{ count: number; results: Product[] }>(`products/?category=${slug}`),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      {category.description && <p className="text-gray-600 mt-2">{category.description}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
        {productsResp.results.map((p) => (
          <a key={p.slug} href={`/product/${p.slug}`} className="group">
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
              <img src={p.images?.[0]?.image_url} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-2">
              <div className="font-medium">{p.name}</div>
              <div className="text-gray-600">${(p.price_cents / 100).toFixed(2)}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}


