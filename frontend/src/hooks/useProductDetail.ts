import { useState, useEffect } from "react";
import { type ProductDetail as ProductDetailType, getProductsByCategory } from "@/lib/api/products";
import { useExploreProducts } from "./useProductSections";

export type ProductCarouselProduct = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  vendor?: string;
  price: string;
  badge?: "new" | "hot" | "both";
  new?: boolean;
  hot?: boolean;
};

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toFixed(2);
};

export function useProductDetail(product: ProductDetailType) {
  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openSubAccordion, setOpenSubAccordion] = useState<string | null>(null);

  // Get all images (main + detail images)
  const allImages =
    product.detail_pic_links && product.detail_pic_links.length > 0
      ? [product.profile_pic_link, ...product.detail_pic_links]
      : [product.profile_pic_link];

  const selectedImage = allImages[selectedImageIndex] || product.profile_pic_link;

  // Price formatting
  const priceStr = formatPrice(product.price);
  const [whole, decimal] = priceStr.split(".");

  // Handlers
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", { productId: product.id, quantity });
  };

  // Fetch related products from same category
  const [relatedProducts, setRelatedProducts] = useState<ProductCarouselProduct[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await getProductsByCategory(product.category_name, 1, 8);
        // Filter out current product
        const filtered = response.results
          .filter((p) => p.id !== product.id)
          .slice(0, 8)
          .map((p) => ({
            name: p.name,
            href: `/products/${p.id}`,
            imageUrl: p.profile_pic_link,
            imageAlt: p.name,
            vendor: p.brand,
            price: formatPrice(p.price),
            new: p.new,
            hot: p.hot,
            badge:
              p.new && p.hot
                ? ("both" as const)
                : p.hot
                  ? ("hot" as const)
                  : p.new
                    ? ("new" as const)
                    : undefined,
          }));
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product.category_name, product.id]);

  // Get "You Might Like" products (using explore products)
  const { products: youMightLikeProducts, isLoading: isLoadingYouMightLike } = useExploreProducts();

  return {
    // Image state
    selectedImageIndex,
    setSelectedImageIndex,
    allImages,
    selectedImage,
    // Quantity state
    quantity,
    handleQuantityChange,
    handleAddToCart,
    // Description state
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    // Accordion state
    openAccordion,
    setOpenAccordion,
    openSubAccordion,
    setOpenSubAccordion,
    // Price formatting
    whole,
    decimal,
    // Related products
    relatedProducts,
    isLoadingRelated,
    // You might like products
    youMightLikeProducts,
    isLoadingYouMightLike,
  };
}
