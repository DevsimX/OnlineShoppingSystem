import CategoryCarousel from "@/components/home/CategoryCarousel";
import HeroSection from "@/components/home/HeroSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import CTASection from "@/components/home/CTASection";
import InstagramFeed from "@/components/home/InstagramFeed";
import Marquee from "@/components/home/Marquee";

// Product data extracted from the HTML
const whatsHotProducts = [
  {
    name: "Contentious Condiments Trio Cheeseboard",
    href: "/products/contentious-condiments-trio-cheeseboard",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/triopack_350x350_crop_center.jpg.webp?v=1760865499",
    imageAlt: "Contentious Condiments Trio Cheeseboard",
    vendor: "Contentious Character Winery",
    price: "24.55",
  },
  {
    name: "Soju Gift Box",
    href: "/products/soju-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0318630_350x350_crop_center.jpg.webp?v=1765260108",
    imageAlt: "Soju Gift Box",
    vendor: "Poncho Fox Distillery",
    price: "83.40",
    badge: "new" as const,
  },
  {
    name: "Ambrosia Vodka Gift Box",
    href: "/products/ambrosia-vodka-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519157_350x350_crop_center.jpg.webp?v=1766308060",
    imageAlt: "Ambrosia Vodka Gift Box",
    vendor: "Ambrosia Distillery",
    price: "85.00",
    badge: "new" as const,
  },
  {
    name: "Novelty Vibes Earrings",
    href: "/products/novelty-vibes-earrings",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/POP_pewpewstudio_250509_38_LR_350x350_crop_center.jpg.webp?v=1762138657",
    imageAlt: "Novelty Vibes Earrings",
    vendor: "Fruity Stones",
    price: "66.00",
  },
  {
    name: "Keep on the Sunny Side Earrings",
    href: "/products/keep-on-the-sunny-side-earrings",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0418878_350x350_crop_center.jpg.webp?v=1766059173",
    imageAlt: "Keep on the Sunny Side Earrings",
    vendor: "Dangly Bits",
    price: "50.00",
  },
  {
    name: "Mango No.5 Candle - Glass",
    href: "/products/mango-no5-candle-glass",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0118098_350x350_crop_center.jpg.webp?v=1765346633",
    imageAlt: "Mango No.5 Candle - Glass",
    vendor: "Lucian Candles",
    price: "35.00",
    badge: "new" as const,
  },
  {
    name: "Sugar Cookie Candle",
    href: "/products/sugar-cookie-candle",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0118069_350x350_crop_center.jpg.webp?v=1765278427",
    imageAlt: "Sugar Cookie Candle",
    vendor: "Zealous & Co",
    price: "34.00",
    badge: "new" as const,
  },
  {
    name: "AVEC FlowState Mango Spritzer - 750ml",
    href: "/products/avec-flowstate-mango-spritzer-750ml",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0318644_350x350_crop_center.jpg.webp?v=1765260777",
    imageAlt: "AVEC FlowState Mango Spritzer - 750ml",
    vendor: "Altina",
    price: "25.00",
    badge: "new" as const,
  },
];

const newStuffProducts = [
  {
    name: "The Fountain Tilda A4 Print",
    href: "/products/the-fountain-tilda-a4-print",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519181_350x350_crop_center.jpg.webp?v=1766308529",
    imageAlt: "The Fountain Tilda A4 Print",
    vendor: "Tilda Joy",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Wood Ducks Tilda A4 Print",
    href: "/products/wood-ducks-tilda-a4-print",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519184_350x350_crop_center.jpg.webp?v=1766308683",
    imageAlt: "Wood Ducks Tilda A4 Print",
    vendor: "Tilda Joy",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Canberra Bus Stop Tilda A4 Print",
    href: "/products/canberra-bus-stop-tilda-a4-print",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519183_350x350_crop_center.jpg.webp?v=1766308634",
    imageAlt: "Canberra Bus Stop Tilda A4 Print",
    vendor: "Tilda Joy",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "National Arboretum Tilda A4 Print",
    href: "/products/national-arboretum-tilda-a4-print",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519174_350x350_crop_center.jpg.webp?v=1766308281",
    imageAlt: "National Arboretum Tilda A4 Print",
    vendor: "Tilda Joy",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Crochet Mini Dragon - Maroon",
    href: "/products/crochet-mini-dragon-maroon",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0619829_350x350_crop_center.jpg.webp?v=1766399248",
    imageAlt: "Crochet Mini Dragon - Maroon",
    vendor: "Josies Crochet",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Crochet Mini Dragon - Blue Purple",
    href: "/products/crochet-mini-dragon-blue-purple",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0619832_24a8ed44-9693-42dc-9ef9-8ed8d34d4139_350x350_crop_center.jpg.webp?v=1766398649",
    imageAlt: "Crochet Mini Dragon - Blue Purple",
    vendor: "Josies Crochet",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Crochet Mini Dragon - Pink",
    href: "/products/crochet-mini-dragon-pink",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0619835_350x350_crop_center.jpg.webp?v=1766399384",
    imageAlt: "Crochet Mini Dragon - Pink",
    vendor: "Josies Crochet",
    price: "50.00",
    badge: "new" as const,
  },
  {
    name: "Crochet Squid",
    href: "/products/crochet-squid",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0619822_350x350_crop_center.jpg.webp?v=1766397645",
    imageAlt: "Crochet Squid",
    vendor: "Josies Crochet",
    price: "40.00",
    badge: "new" as const,
  },
];

const giftBoxProducts = [
  {
    name: "Flora Trio Pack",
    href: "/products/flora-trio-pack",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/original_c3e76064-5acc-43e8-aac4-c18a69701059_350x350_crop_center.jpg.webp?v=1759734323",
    imageAlt: "Flora Trio Pack 1",
    vendor: "Local Spirit Group",
    price: "76.00",
  },
  {
    name: "Soju Gift Box",
    href: "/products/soju-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POPLOCAL_DAY_0318630_350x350_crop_center.jpg.webp?v=1765260108",
    imageAlt: "Soju Gift Box",
    vendor: "Poncho Fox Distillery",
    price: "83.40",
    badge: "new" as const,
  },
  {
    name: "Riverbourne Gift Box",
    href: "/products/riverbourne-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/original_6e915979-75b3-4120-9dd8-faa4509d91d5_350x350_crop_center.jpg.webp?v=1759734344",
    imageAlt: "Riverbourne Gift Box Regular 1",
    vendor: "Riverbourne Distillery Pty Ltd",
    price: "123.10",
    badge: "hot" as const,
  },
  {
    name: "Poncho Fox Gift Box Rum Mix",
    href: "/products/poncho-fox-gift-box-rum-mix",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0619840_350x350_crop_center.jpg.webp?v=1766499411",
    imageAlt: "Poncho Fox Gift Box Rum Mix",
    vendor: "Poncho Fox Distillery",
    price: "83.40",
    badge: "new" as const,
  },
  {
    name: "Poncho Fox Gift Box Mix",
    href: "/products/poncho-fox-gift-box-mix",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519152_350x350_crop_center.jpg.webp?v=1766308014",
    imageAlt: "Poncho Fox Gift Box Mix",
    vendor: "Poncho Fox Distillery",
    price: "83.40",
    badge: "hot" as const,
  },
  {
    name: "Speciality Selection Hot Choc Bomb Gift Box",
    href: "/products/speciality-selection-hot-choc-bomb-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/POPCANBERRA_pewpewstudio_240830_1289_LR_350x350_crop_center.jpg.webp?v=1760828329",
    imageAlt: "Speciality Selection Hot Choc Bomb Gift Box",
    vendor: "Kate's Bombs",
    price: "60.00",
  },
  {
    name: "Thank You Pack",
    href: "/products/thank-you-pack",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/POP-CBR-Product-GiftBoxes-251024-LR-052_350x350_crop_center.jpg.webp?v=1762921032",
    imageAlt: "Thank You Pack",
    vendor: "POP Local",
    price: "45.00",
    badge: "new" as const,
  },
  {
    name: "The Big Thank You Gift Box",
    href: "/products/the-big-thank-you-gift-box",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/POP-CBR-Product-GiftBoxes-251024-LR-034_350x350_crop_center.jpg.webp?v=1762827055",
    imageAlt: "The Big Thank You Gift Box",
    vendor: "POP Local",
    price: "100.00",
    badge: "new" as const,
  },
];

const moreToExploreProducts = [
  {
    name: "Unwinding Artwork Print - A4",
    href: "/products/unwinding-artwork-print-a4",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519185_350x350_crop_center.jpg.webp?v=1766308809",
    imageAlt: "Unwinding Artwork Print - A4",
    vendor: "Julia Ockert Art",
    price: "42.00",
    badge: "new" as const,
  },
  {
    name: "Morning Coffee Artwork Print - A4",
    href: "/products/morning-coffee-artwork-print-a4",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519197_350x350_crop_center.jpg.webp?v=1766310039",
    imageAlt: "Morning Coffee Artwork Print - A4",
    vendor: "Julia Ockert Art",
    price: "42.00",
    badge: "new" as const,
  },
  {
    name: "Gang Gang Artwork Print - A4",
    href: "/products/gang-gang-artwork-print-a4",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519196_350x350_crop_center.jpg.webp?v=1766309958",
    imageAlt: "Gang Gang Artwork Print - A4",
    vendor: "Julia Ockert Art",
    price: "42.00",
    badge: "new" as const,
  },
  {
    name: "Ginpeachment Gin 200ml",
    href: "/products/ginpeachment-gin-200ml",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519324_350x350_crop_center.jpg.webp?v=1766318191",
    imageAlt: "Ginpeachment Gin 200ml",
    vendor: "The Prime Ginister",
    price: "39.00",
    badge: "new" as const,
  },
  {
    name: "Ginister For Defence Navy Strength Gin 200ml",
    href: "/products/ginister-for-defence-navy-strength-gin-200ml",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519328_350x350_crop_center.jpg.webp?v=1766318239",
    imageAlt: "Ginister For Defence Navy Strength Gin 200ml",
    vendor: "The Prime Ginister",
    price: "41.00",
    badge: "new" as const,
  },
  {
    name: "Signature Gin 200ml",
    href: "/products/signature-gin-200ml",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519322_350x350_crop_center.jpg.webp?v=1766318120",
    imageAlt: "Signature Gin 200ml",
    vendor: "The Prime Ginister",
    price: "36.00",
    badge: "new" as const,
  },
  {
    name: "Lychee Soju - 200ml",
    href: "/products/lychee-soju-200ml",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519319_350x350_crop_center.jpg.webp?v=1766315994",
    imageAlt: "Lychee Soju - 200ml",
    vendor: "Poncho Fox Distillery",
    price: "35.00",
    badge: "new" as const,
  },
  {
    name: "Poncho Fox Gift Box Mix",
    href: "/products/poncho-fox-gift-box-mix",
    imageUrl: "https://cdn.shopify.com/s/files/1/0724/9674/2585/files/final_POP_LOCAL_DAY_0519152_350x350_crop_center.jpg.webp?v=1766308014",
    imageAlt: "Poncho Fox Gift Box Mix",
    vendor: "Poncho Fox Distillery",
    price: "83.40",
    badge: "hot" as const,
  },
];

export default function Home() {
  return (
    <main style={{ viewTransitionName: "main-content" }}>
      <CategoryCarousel />
      <HeroSection />
      <Marquee />
      <ProductCarousel title="What's Hot" titleHref="/collections/whats-hot" products={whatsHotProducts} />
      <CategoryGrid />
      <ProductCarousel title="New Stuff" titleHref="/collections/new-stuff" products={newStuffProducts} />
      <ProductCarousel title="Gift Boxes" titleHref="/collections/gift-boxes" products={giftBoxProducts} />
      <ProductCarousel title="More to Explore" titleHref="/collections/all-products" products={moreToExploreProducts} />
      <CTASection />
      <InstagramFeed />
      <Marquee />
    </main>
  );
}
