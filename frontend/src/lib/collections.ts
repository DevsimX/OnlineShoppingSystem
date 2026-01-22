// Static collections data extracted from Header component
// Format: { name: string, slug: string }
export const COLLECTIONS = [
  // Shop > Gifts
  { name: "Gifts", slug: "gifts" },
  { name: "Gift Boxes", slug: "gift-boxes" },
  { name: "Gifts Under $10", slug: "gifts-under-10" },
  { name: "Gifts Under $25", slug: "gifts-under-25" },
  { name: "Gifts Under $50", slug: "gifts-under-50" },
  { name: "Gifts Under $100", slug: "gifts-under-100" },
  { name: "Gifts For Men", slug: "gifts-for-men" },
  { name: "Gifts For Women", slug: "gifts-for-women" },
  { name: "Gifts For Kids", slug: "gifts-for-kids" },
  { name: "Unique Gifts", slug: "unique-gifts" },
  { name: "Corporate Gifts", slug: "corporate-gifting" },
  // Shop > Standalone
  { name: "What's Hot", slug: "whats-hot" },
  { name: "New Stuff", slug: "new-stuff" },
  // Shop > Food & Drinks
  { name: "Food & Drinks", slug: "food-drinks" },
  { name: "Beer, Wine & Spirits", slug: "beer-wine-spirits" },
  { name: "Non-Alc Drinks", slug: "non-alcoholic-drinks" },
  { name: "Confectionary", slug: "sweet-treats" },
  { name: "Snacks", slug: "snacks" },
  { name: "Coffee & Tea", slug: "coffee-tea" },
  { name: "Cooking & Condiments", slug: "cooking-condiments" },
  // Shop > Fashion
  { name: "Fashion", slug: "fashion" },
  { name: "Accessories", slug: "accessories" },
  { name: "Jewellery", slug: "jewellery" },
  // Shop > Body
  { name: "Body", slug: "body" },
  { name: "Skincare", slug: "skincare" },
  { name: "Bath", slug: "bath" },
  { name: "Beauty & Fragrance", slug: "beauty-fragrances" },
  // Shop > Stationery
  { name: "Stationery", slug: "stationery" },
  { name: "Greeting Cards", slug: "greeting-cards" },
  { name: "Stickers & Stationery", slug: "stationery" },
  { name: "Games", slug: "games" },
  { name: "Kids Toys", slug: "kids-toys" },
  // Shop > Memorabilia
  { name: "Memorabilia", slug: "memorabilia" },
  { name: "Canberra Merch", slug: "canberra-merch" },
  { name: "POP Merch", slug: "pop-merch" },
  // Shop > Home
  { name: "Home", slug: "home" },
  { name: "Candles & Diffusers", slug: "candles-diffusers" },
  { name: "Ceramics & Tableware", slug: "ceramics-tableware" },
  { name: "Prints", slug: "prints" },
  { name: "Books", slug: "books" },
  { name: "Pet Goods", slug: "pet-goods" },
  // Brands
  { name: "Allara Creative", slug: "allara-creative" },
  { name: "Bakers Wanna Bake", slug: "bakers-wanna-bake" },
  { name: "Bearlymade", slug: "bearlymade" },
  { name: "Burley & Brave", slug: "burley-brave" },
  { name: "Contentious Character Winery", slug: "contentious-character-winery" },
  { name: "Cygnet & Pen", slug: "cygnet-and-pen" },
  { name: "Jasper & Myrtle", slug: "jasper-myrtle-chocolates" },
  { name: "Kate's Bombs", slug: "kates-bombs" },
  { name: "KOKOArtisan", slug: "kokoartisan" },
  { name: "La Source Australia", slug: "la-source" },
  { name: "Leafy Sea Dragon", slug: "leafy-sea-dragon" },
  { name: "North/South Print Shop", slug: "north-south-print-shop" },
  { name: "Poncho Fox", slug: "poncho-fox" },
  { name: "Trevor Dickinson Art", slug: "trevor-dickinson-art" },
  { name: "Zealous & Co.", slug: "zealous-co" },
] as const;

/**
 * Search collections by name (strict contain check, case-insensitive)
 * @param query - Search query string
 * @param limit - Maximum number of results
 * @returns Array of collection objects with name and slug
 */
export function searchCollections(query: string, limit: number = 8): Array<{ name: string; slug: string }> {
  if (!query || !query.trim()) {
    return [];
  }

  const searchText = query.trim().toLowerCase();
  const matches = COLLECTIONS.filter((collection) =>
    collection.name.toLowerCase().includes(searchText)
  );

  // Sort by position of match (earlier matches first) and then alphabetically
  const sorted = matches.sort((a, b) => {
    const aIndex = a.name.toLowerCase().indexOf(searchText);
    const bIndex = b.name.toLowerCase().indexOf(searchText);
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return a.name.localeCompare(b.name);
  });

  return sorted.slice(0, limit);
}
