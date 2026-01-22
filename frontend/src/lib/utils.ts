/**
 * Format price to whole and decimal parts
 */
export function formatPrice(price: string | number): { whole: string; decimal: string } {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const [whole, decimal] = numPrice.toFixed(2).split(".");
  return { whole, decimal };
}

/**
 * Format price as string (for display in carousels, etc.)
 */
export function formatPriceString(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toFixed(2);
}
