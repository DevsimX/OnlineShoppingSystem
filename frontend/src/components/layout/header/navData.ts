import type { DropdownMenuItem, MobileSheetMenuItem, NavLinkItem } from "./types";

// Dropdown menu items (Shop, Brands, Gifts)
export const dropdownMenuItems: DropdownMenuItem[] = [
  {
    label: "Shop",
    items: [
      {
        type: "category",
        header: { label: "Gifts", href: "/collections/gifts" },
        links: [
          { label: "Gift Boxes", href: "/collections/gift-boxes" },
          { label: "Gift Cards", href: "/products/pop-gift-card" },
          { label: "Gifts Under $10", href: "/collections/gifts-under-10" },
          { label: "Gifts Under $25", href: "/collections/gifts-under-25" },
          { label: "Gifts Under $50", href: "/collections/gifts-under-50" },
          { label: "Gifts Under $100", href: "/collections/gifts-under-100" },
          { label: "Gifts For Men", href: "/collections/gifts-for-men" },
          { label: "Gifts For Women", href: "/collections/gifts-for-women" },
          { label: "Gifts For Kids", href: "/collections/gifts-for-kids" },
          { label: "Unique Gifts", href: "/collections/unique-gifts" },
          { label: "Corporate Gifts", href: "/collections/corporate-gifting" },
        ],
      },
      {
        type: "standalone",
        links: [{ label: "What's Hot", href: "/collections/whats-hot" }],
      },
      {
        type: "standalone",
        links: [{ label: "New Stuff", href: "/collections/new-stuff" }],
      },
      {
        type: "category",
        header: { label: "Food & Drinks", href: "/collections/food-drinks" },
        links: [
          { label: "Beer, Wine & Spirits", href: "/collections/beer-wine-spirits" },
          { label: "Non-Alc Drinks", href: "/collections/non-alcoholic-drinks" },
          { label: "Confectionary", href: "/collections/sweet-treats" },
          { label: "Snacks", href: "/collections/snacks" },
          { label: "Coffee & Tea", href: "/collections/coffee-tea" },
          { label: "Cooking & Condiments", href: "/collections/cooking-condiments" },
        ],
      },
      {
        type: "category",
        header: { label: "Fashion", href: "/collections/fashion" },
        links: [
          { label: "Accessories", href: "/collections/accessories" },
          { label: "Jewellery", href: "/collections/jewellery" },
        ],
      },
      {
        type: "category",
        header: { label: "Body", href: "/collections/body" },
        links: [
          { label: "Skincare", href: "/collections/skincare" },
          { label: "Bath", href: "/collections/bath" },
          { label: "Beauty & Fragrance", href: "/collections/beauty-fragrances" },
        ],
      },
      {
        type: "category",
        header: { label: "Stationery", href: "/collections/stationery" },
        links: [
          { label: "Greeting Cards", href: "/collections/greeting-cards" },
          { label: "Stickers & Stationery", href: "/collections/stationery" },
          { label: "Games", href: "/collections/games" },
          { label: "Kids Toys", href: "/collections/kids-toys" },
        ],
      },
      {
        type: "category",
        header: { label: "Memorabilia", href: "/collections/memorabilia" },
        links: [
          { label: "Canberra Merch", href: "/collections/canberra-merch" },
          { label: "POP Merch", href: "/collections/pop-merch" },
        ],
      },
      {
        type: "category",
        header: { label: "Home", href: "/collections/home" },
        links: [
          { label: "Candles & Diffusers", href: "/collections/candles-diffusers" },
          { label: "Ceramics & Tableware", href: "/collections/ceramics-tableware" },
          { label: "Prints", href: "/collections/prints" },
          { label: "Books", href: "/collections/books" },
          { label: "Pet Goods", href: "/collections/pet-goods" },
        ],
      },
    ],
  },
  {
    label: "Brands",
    items: [
      {
        type: "category",
        header: { label: "Featured Brands" },
        links: [
          { label: "Allara Creative", href: "/collections/allara-creative" },
          { label: "Bakers Wanna Bake", href: "/collections/bakers-wanna-bake" },
          { label: "Bearlymade", href: "/collections/bearlymade" },
          { label: "Burley & Brave", href: "/collections/burley-brave" },
          { label: "Contentious Character Winery", href: "/collections/contentious-character-winery" },
          { label: "Cygnet & Pen", href: "/collections/cygnet-and-pen" },
          { label: "Jasper & Myrtle", href: "/collections/jasper-myrtle-chocolates" },
          { label: "Kate's Bombs", href: "/collections/kates-bombs" },
          { label: "KOKOArtisan", href: "/collections/kokoartisan" },
          { label: "La Source Australia", href: "/collections/la-source" },
          { label: "Leafy Sea Dragon", href: "/collections/leafy-sea-dragon" },
          { label: "North/South Print Shop", href: "/collections/north-south-print-shop" },
          { label: "Poncho Fox", href: "/collections/poncho-fox" },
          { label: "Trevor Dickinson Art", href: "/collections/trevor-dickinson-art" },
          { label: "Zealous & Co.", href: "/collections/zealous-co" },
        ],
      },
    ],
  },
  {
    label: "Gifts",
    items: [
      {
        type: "standalone",
        links: [
          {
            label: "Gifts Under $10",
            href: "/collections/gifts-under-10",
            className: "font-ultra-bold font-black uppercase",
          },
        ],
      },
      {
        type: "standalone",
        links: [
          {
            label: "Gifts Under $25",
            href: "/collections/gifts-under-25",
            className: "font-ultra-bold font-black uppercase",
          },
        ],
      },
      {
        type: "standalone",
        links: [
          {
            label: "Gifts Under $50",
            href: "/collections/gifts-under-50",
            className: "font-ultra-bold font-black uppercase",
          },
        ],
      },
      {
        type: "standalone",
        links: [
          {
            label: "Gifts Under $100",
            href: "/collections/gifts-under-100",
            className: "font-ultra-bold font-black uppercase",
          },
        ],
      },
      {
        type: "standalone",
        links: [{ label: "Gift Boxes", href: "/collections/gift-boxes" }],
      },
      {
        type: "standalone",
        links: [{ label: "Gifts For Men", href: "/collections/gifts-for-men" }],
      },
      {
        type: "standalone",
        links: [{ label: "Gifts For Women", href: "/collections/gifts-for-women" }],
      },
      {
        type: "standalone",
        links: [{ label: "Gifts For Kids", href: "/collections/gifts-for-kids" }],
      },
      {
        type: "standalone",
        links: [{ label: "Gift Cards", href: "/products/pop-gift-card" }],
      },
      {
        type: "standalone",
        links: [{ label: "Unique Gifts", href: "/collections/unique-gifts" }],
      },
      {
        type: "standalone",
        links: [{ label: "Corporate Gifts", href: "/collections/corporate-gifting" }],
      },
    ],
  },
];

// Simple navigation links
export const navLinkItems: NavLinkItem[] = [
  { label: "What's Hot", href: "/collections/whats-hot" },
  { label: "New Stuff", href: "/collections/new-stuff" },
  { label: "Gift Cards", href: "/products/pop-gift-card" },
];

// Mobile sheet menu items (structure matches the provided source HTML)
const mobileLinkBase = "block py-1.5 tracking-wide";
const mobileLinkStrongUpper = `${mobileLinkBase} font-ultra-bold font-black uppercase`;
const mobileHeading = `${mobileLinkBase} font-semibold`;

export const mobileSheetMenuItems: MobileSheetMenuItem[] = [
  {
    label: "Shop",
    sections: [
      {
        type: "accordion",
        title: "Gifts",
        links: [
          { label: "Gift Boxes", href: "/collections/gift-boxes" },
          { label: "Gift Cards", href: "/products/pop-gift-card" },
          { label: "Gifts Under $10", href: "/collections/gifts-under-10" },
          { label: "Gifts Under $25", href: "/collections/gifts-under-25" },
          { label: "Gifts Under $50", href: "/collections/gifts-under-50" },
          { label: "Gifts Under $100", href: "/collections/gifts-under-100" },
          { label: "Gifts For Men", href: "/collections/gifts-for-men" },
          { label: "Gifts For Women", href: "/collections/gifts-for-women" },
          { label: "Gifts For Kids", href: "/collections/gifts-for-kids" },
          { label: "Unique Gifts", href: "/collections/unique-gifts" },
          { label: "Corporate Gifts", href: "/collections/corporate-gifting" },
        ],
      },
      {
        type: "link",
        label: "Valentine's Day",
        href: "/collections/valentines-day",
        className: mobileLinkStrongUpper,
      },
      {
        type: "link",
        label: "What's Hot",
        href: "/collections/whats-hot",
        className: mobileLinkStrongUpper,
      },
      {
        type: "link",
        label: "New Stuff",
        href: "/collections/new-stuff",
        className: mobileLinkStrongUpper,
      },
      {
        type: "accordion",
        title: "Food & Drinks",
        links: [
          { label: "Beer, Wine & Spirits", href: "/collections/beer-wine-spirits" },
          { label: "Non-Alc Drinks", href: "/collections/non-alcoholic-drinks" },
          { label: "Confectionary", href: "/collections/sweet-treats" },
          { label: "Snacks", href: "/collections/snacks" },
          { label: "Coffee & Tea", href: "/collections/coffee-tea" },
          { label: "Cooking & Condiments", href: "/collections/cooking-condiments" },
        ],
      },
      {
        type: "accordion",
        title: "Fashion",
        links: [
          { label: "Accessories", href: "/collections/accessories" },
          { label: "Jewellery", href: "/collections/jewellery" },
        ],
      },
      {
        type: "accordion",
        title: "Body",
        links: [
          { label: "Skincare", href: "/collections/skincare" },
          { label: "Bath", href: "/collections/bath" },
          { label: "Beauty & Fragrance", href: "/collections/beauty-fragrances" },
        ],
      },
      {
        type: "accordion",
        title: "Stationery",
        links: [
          { label: "Greeting Cards", href: "/collections/greeting-cards" },
          { label: "Stickers & Stationery", href: "/collections/stationery" },
          { label: "Games", href: "/collections/games" },
          { label: "Kids Toys", href: "/collections/kids-toys" },
        ],
      },
      {
        type: "accordion",
        title: "Memorabilia",
        links: [
          { label: "Canberra Merch", href: "/collections/canberra-merch" },
          { label: "POP Merch", href: "/collections/pop-merch" },
        ],
      },
      {
        type: "accordion",
        title: "Home",
        links: [
          { label: "Candles & Diffusers", href: "/collections/candles-diffusers" },
          { label: "Ceramics & Tableware", href: "/collections/ceramics-tableware" },
          { label: "Prints", href: "/collections/prints" },
          { label: "Books", href: "/collections/books" },
          { label: "Pet Goods", href: "/collections/pet-goods" },
        ],
      },
    ],
  },
  {
    label: "Brands",
    sections: [
      { type: "heading", label: "Featured Brands", className: mobileHeading },
      { type: "link", label: "Allara Creative", href: "/collections/allara-creative", className: mobileLinkBase },
      { type: "link", label: "Bakers Wanna Bake", href: "/collections/bakers-wanna-bake", className: mobileLinkBase },
      { type: "link", label: "Bearlymade", href: "/collections/bearlymade", className: mobileLinkBase },
      { type: "link", label: "Burley & Brave", href: "/collections/burley-brave", className: mobileLinkBase },
      { type: "link", label: "Contentious Character Winery", href: "/collections/contentious-character-winery", className: mobileLinkBase },
      { type: "link", label: "Cygnet & Pen", href: "/collections/cygnet-and-pen", className: mobileLinkBase },
      { type: "link", label: "Jasper & Myrtle", href: "/collections/jasper-myrtle-chocolates", className: mobileLinkBase },
      { type: "link", label: "Kate's Bombs", href: "/collections/kates-bombs", className: mobileLinkBase },
      { type: "link", label: "KOKOArtisan", href: "/collections/kokoartisan", className: mobileLinkBase },
      { type: "link", label: "La Source Australia", href: "/collections/la-source", className: mobileLinkBase },
      { type: "link", label: "Leafy Sea Dragon", href: "/collections/leafy-sea-dragon", className: mobileLinkBase },
      { type: "link", label: "North/South Print Shop", href: "/collections/north-south-print-shop", className: mobileLinkBase },
      { type: "link", label: "Poncho Fox", href: "/collections/poncho-fox", className: mobileLinkBase },
      { type: "link", label: "Trevor Dickinson Art", href: "/collections/trevor-dickinson-art", className: mobileLinkBase },
      { type: "link", label: "Zealous & Co.", href: "/collections/zealous-co", className: mobileLinkBase },
    ],
  },
  {
    label: "Gifts",
    sections: [
      { type: "link", label: "Gifts Under $10", href: "/collections/gifts-under-10", className: mobileLinkStrongUpper },
      { type: "link", label: "Gifts Under $25", href: "/collections/gifts-under-25", className: mobileLinkStrongUpper },
      { type: "link", label: "Gifts Under $50", href: "/collections/gifts-under-50", className: mobileLinkStrongUpper },
      { type: "link", label: "Gifts Under $100", href: "/collections/gifts-under-100", className: mobileLinkStrongUpper },
      { type: "link", label: "Gift Boxes", href: "/collections/gift-boxes", className: mobileLinkBase },
      { type: "link", label: "Gifts For Men", href: "/collections/gifts-for-men", className: mobileLinkBase },
      { type: "link", label: "Gifts For Women", href: "/collections/gifts-for-women", className: mobileLinkBase },
      { type: "link", label: "Gifts For Kids", href: "/collections/gifts-for-kids", className: mobileLinkBase },
      { type: "link", label: "Gift Cards", href: "/products/pop-gift-card", className: mobileLinkBase },
      { type: "link", label: "Unique Gifts", href: "/collections/unique-gifts", className: mobileLinkBase },
      { type: "link", label: "Corporate Gifts", href: "/collections/corporate-gifting", className: mobileLinkBase },
    ],
  },
];

