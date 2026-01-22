import { useState, useEffect } from "react";
import { type ProductDetail as ProductDetailType, getProductsByBrand, getYouMightLikeProducts } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/contexts/CartContext";
import { formatPriceString } from "@/lib/utils";

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
  const selectedImage = selectedImageData?.big_pic_link || product.profile_pic_link;
  const selectedModalImage = selectedImageData?.extra_big_pic_link || selectedImage;
  
  // Initialize thumbnail loading states when images change
  useEffect(() => {
    const initialStates: Record<number, boolean> = {};
    allImages.forEach((_, index) => {
      // Only set loading to true for new thumbnails that haven't been loaded yet
      if (thumbnailLoadingStates[index] === undefined) {
        initialStates[index] = true;
      }
    });
    // Only update states for new thumbnails, preserve existing ones
    if (Object.keys(initialStates).length > 0) {
      setThumbnailLoadingStates((prev) => ({ ...prev, ...initialStates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allImages.length]);
  
  // Reset main image loading when image changes
  useEffect(() => {
    setMainImageLoading(true);
    
    // Check if image is already loaded (cached images)
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        // Image is already loaded/cached, set loading to false immediately
        setMainImageLoading(false);
      };
      img.onerror = () => {
        // Image failed to load, set loading to false
        setMainImageLoading(false);
      };
      img.src = selectedImage;
      
      // If image is already complete (cached), the onload won't fire, so check complete property
      if (img.complete) {
        setMainImageLoading(false);
      }
    }
    
    // Fallback: Set loading to false after 10 seconds in case image fails to load
    const timeoutId = setTimeout(() => {
      setMainImageLoading(false);
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, [selectedImageIndex, selectedImage]);
  
  // Reset modal image loading when modal opens
  useEffect(() => {
    if (isImageModalOpen) {
      setModalImageLoading(true);
      
      // Fallback: Set loading to false after 10 seconds in case image fails to load
      const timeoutId = setTimeout(() => {
        setModalImageLoading(false);
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isImageModalOpen, selectedImage]);
  
  // Handlers for image loading
  const handleMainImageLoad = () => {
    setMainImageLoading(false);
  };
  
  const handleMainImageError = () => {
    // If image fails to load, hide loading skeleton
    setMainImageLoading(false);
  };
  
  const handleThumbnailLoad = (index: number) => {
    setThumbnailLoadingStates((prev) => ({ ...prev, [index]: false }));
  };
  
  const handleThumbnailError = (index: number) => {
    // If thumbnail fails to load, hide loading skeleton
    setThumbnailLoadingStates((prev) => ({ ...prev, [index]: false }));
  };
  
  const handleModalImageLoad = () => {
    setModalImageLoading(false);
  };
  
  const handleModalImageError = () => {
    // If modal image fails to load, hide loading skeleton
    setModalImageLoading(false);
  };
  
  const handleThumbnailLoadingStart = (index: number) => {
    setThumbnailLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  // Price formatting
  const priceStr = formatPriceString(product.price);
  const [whole, decimal] = priceStr.split(".");

  // Handlers
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      // Don't allow quantity below 1 or above current stock
      return Math.max(1, Math.min(newQuantity, product.current_stock));
    });
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { openCart, refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      await refreshCart();
      openCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // TODO: Show error toast/notification
    } finally {
      setIsAddingToCart(false);
    }
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
            price: formatPriceString(p.price),
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

  // Get "You Might Like" products (products with same type)
  const [youMightLikeProducts, setYouMightLikeProducts] = useState<ProductCarouselProduct[]>([]);
  const [isLoadingYouMightLike, setIsLoadingYouMightLike] = useState(true);

  useEffect(() => {
    const fetchYouMightLike = async () => {
      try {
        const response = await getYouMightLikeProducts(product.id);
        const formatted = response.map((p) => ({
          name: p.name,
          href: `/products/${p.id}`,
          imageUrl: p.profile_pic_link,
          imageAlt: p.name,
          vendor: p.brand,
          price: formatPriceString(p.price),
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
        setYouMightLikeProducts(formatted);
      } catch (error) {
        console.error("Failed to fetch you might like products:", error);
        setYouMightLikeProducts([]);
      } finally {
        setIsLoadingYouMightLike(false);
      }
    };

    fetchYouMightLike();
  }, [product.id]);

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
    // Add to cart loading state
    isAddingToCart,
    // Error handlers
    handleMainImageError,
    handleThumbnailError,
    handleModalImageError,
  };
}
