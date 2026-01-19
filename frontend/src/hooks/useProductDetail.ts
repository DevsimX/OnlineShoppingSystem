import { useState, useEffect } from "react";
import { type ProductDetail as ProductDetailType, getProductsByBrand } from "@/lib/api/products";
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Image loading states
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [thumbnailLoadingStates, setThumbnailLoadingStates] = useState<Record<number, boolean>>({});
  const [modalImageLoading, setModalImageLoading] = useState(false);

  // Get all images (only detail images, excluding profile image)
  const allImages =
    product.detail_pics && product.detail_pics.length > 0
      ? product.detail_pics
      : []; // Empty array if no detail images exist

  // Get selected image data
  const selectedImageData = allImages[selectedImageIndex];
  const selectedThumbnail = selectedImageData?.small_pic_link || product.profile_pic_link;
  const selectedImage = selectedImageData?.big_pic_link || product.profile_pic_link;
  const selectedModalImage = selectedImageData?.extra_big_pic_link || selectedImage;
  
  // Initialize thumbnail loading states
  useEffect(() => {
    const initialStates: Record<number, boolean> = {};
    allImages.forEach((_, index) => {
      initialStates[index] = true;
    });
    setThumbnailLoadingStates(initialStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allImages.length]);
  
  // Reset main image loading when image changes
  useEffect(() => {
    setMainImageLoading(true);
  }, [selectedImageIndex]);
  
  // Reset modal image loading when modal opens
  useEffect(() => {
    if (isImageModalOpen) {
      setModalImageLoading(true);
    }
  }, [isImageModalOpen, selectedImage]);
  
  // Handlers for image loading
  const handleMainImageLoad = () => {
    setMainImageLoading(false);
  };
  
  const handleThumbnailLoad = (index: number) => {
    setThumbnailLoadingStates((prev) => ({ ...prev, [index]: false }));
  };
  
  const handleModalImageLoad = () => {
    setModalImageLoading(false);
  };
  
  const handleThumbnailLoadingStart = (index: number) => {
    setThumbnailLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  // Price formatting
  const priceStr = formatPrice(product.price);
  const [whole, decimal] = priceStr.split(".");

  // Handlers
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      // Don't allow quantity below 1 or above current stock
      return Math.max(1, Math.min(newQuantity, product.current_stock));
    });
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", { productId: product.id, quantity });
  };

  // Fetch related products from same brand
  const [relatedProducts, setRelatedProducts] = useState<ProductCarouselProduct[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (!product.brand_id) {
          setIsLoadingRelated(false);
          return;
        }
        const response = await getProductsByBrand(product.brand_id, 1, 8);
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
  }, [product.brand_id, product.id]);

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
    // Image modal state
    isImageModalOpen,
    setIsImageModalOpen,
    // Image loading states
    mainImageLoading,
    thumbnailLoadingStates,
    modalImageLoading,
    handleMainImageLoad,
    handleThumbnailLoad,
    handleModalImageLoad,
    handleThumbnailLoadingStart,
    // Modal image URL
    selectedModalImage,
  };
}
