import Link from "next/link";

export default function Home() {
  // Placeholder data - backend not ready yet
  const categories: { name: string; slug: string; description: string; image_url: string }[] = [];
  const products: {
    name: string;
    slug: string;
    short_description: string;
    price_cents: number;
    images: { image_url: string }[];
    category: { name: string; slug: string; description: string; image_url: string };
  }[] = [];
  const snackProducts: typeof products = [];
  const giftBoxProducts: typeof products = [];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="pattern-band h-6 md:h-8 w-full" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="hero-card grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10 p-8 md:p-14">
            <div className="text-white md:pr-8">
              <div className="text-pop-gold text-3xl md:text-4xl font-extrabold mb-2">G&apos;day Canberra!</div>
              <h1 className="section-heading md:text-6xl leading-[0.95]">YOUR FAVE LOCAL HAS A FRESH NEW LOOK</h1>
              <a href="#shop" className="btn-pop-outline mt-8">VISIT OUR STORE →</a>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-80 md:h-[420px] card-pop overflow-hidden bg-white">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Store Image
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pattern-band h-6 md:h-8 w-full" />
      </section>

      {/* Badges row */}
      <div className="badges-bar marquee">
        <div className="marquee-track">
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>FREE SHIPPING OVER $100</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>EARN REWARDS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>ALL LOCAL GOODS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>PICK UP AND DELIVERY</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>FREE SHIPPING OVER $100</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>EARN REWARDS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>ALL LOCAL GOODS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>PICK UP AND DELIVERY</span>
        </div>
        <div className="marquee-track" aria-hidden>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>FREE SHIPPING OVER $100</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>EARN REWARDS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>ALL LOCAL GOODS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>PICK UP AND DELIVERY</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>FREE SHIPPING OVER $100</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>EARN REWARDS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>ALL LOCAL GOODS</span>
          <img src="/icons/smile.svg" alt="" aria-hidden className="marquee-icon" />
          <span>PICK UP AND DELIVERY</span>
        </div>
      </div>

      {/* Promo bar */}
      <div className="mx-auto max-w-xl px-6">
        <div className="promo-bar mt-6 text-center py-3 font-extrabold">CLAIM 10% OFF!</div>
      </div>

      <section id="shop" className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Shop</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((c) => (
              <a key={c.slug} href={`/category/${c.slug}`} className="group relative overflow-hidden rounded-lg border p-4 hover:shadow">
                <img src={c.image_url} alt={c.name} className="h-36 w-full object-cover rounded" />
                <div className="mt-2 font-medium">{c.name}</div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">Categories coming soon...</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h2 id="best-sellers" className="text-2xl md:text-3xl font-extrabold">Best Sellers</h2>
          <a href="#" className="btn-pop text-sm px-4 py-1">EXPLORE ALL →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((p, i) => (
              <a key={p.slug} href={`/product/${p.slug}`} className="group relative">
                <div className="aspect-square overflow-hidden card-pop bg-gray-50">
                  <img src={p.images?.[0]?.image_url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                {(i === 0 || i === 1) && (
                  <span className="star-badge">{i === 0 ? "Hot" : "New"}</span>
                )}
                <div className="mt-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-600">${(p.price_cents / 100).toFixed(2)}</div>
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">Products coming soon...</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex items-center justify-between mb-2">
          <h2 id="unique-gifts" className="text-2xl md:text-3xl font-extrabold">Unique Gift Ideas</h2>
          <a href="#" className="btn-pop text-sm px-4 py-1">EXPLORE ALL →</a>
        </div>
        <p className="text-gray-600 mb-4">Explore curated gifts from local makers.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.slice(0, 4).map((p, i) => (
              <a key={p.slug} href={`/product/${p.slug}`} className="group relative">
                <div className="aspect-square overflow-hidden card-pop bg-gray-50">
                  <img src={p.images?.[0]?.image_url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                {(i === 0 || i === 1) && (
                  <span className="star-badge">{i === 0 ? "Hot" : "New"}</span>
                )}
                <div className="mt-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-600">${(p.price_cents / 100).toFixed(2)}</div>
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">Gift ideas coming soon...</p>
          )}
        </div>
      </section>

      {/* Feeling Snacky */}
      {snackProducts.length > 0 && (
        <section id="snacky" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Feeling Snacky?</h2>
            <Link href="/category/snacks-sauces" className="text-sm underline">Explore All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {snackProducts.map((p) => (
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
        </section>
      )}

      {/* Become a seller CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-xl border bg-gray-50 p-8 md:p-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Become a seller</h3>
            <p className="text-gray-600 mt-1">Showcase your goods and join our community of makers.</p>
          </div>
          <a href="#" className="mt-4 md:mt-0 inline-block bg-black text-white px-5 py-2 rounded">Learn More</a>
        </div>
      </section>

      {giftBoxProducts.length > 0 && (
        <section id="gift-boxes" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Gift Boxes</h2>
            <Link href="/category/gift-boxes" className="text-sm underline">Explore All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {giftBoxProducts.map((p, i) => (
              <a key={p.slug} href={`/product/${p.slug}`} className="group relative">
                <div className="aspect-square overflow-hidden card-pop bg-gray-50">
                  <img src={p.images?.[0]?.image_url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                {(i === 0 || i === 1) && (
                  <span className="star-badge">{i === 0 ? "Hot" : "New"}</span>
                )}
                <div className="mt-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-600">${(p.price_cents / 100).toFixed(2)}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
