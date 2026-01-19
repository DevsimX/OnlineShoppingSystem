"use client";

import Image from "next/image";
import Link from "next/link";
import { ZoomIn, Plus, Minus, ShoppingBag, ChevronDown } from "lucide-react";
import { type ProductDetail as ProductDetailType } from "@/lib/api/products";
import { useProductDetail } from "@/hooks/useProductDetail";
import Hot from "@/assets/hot.svg";
import New from "@/assets/new.svg";
import MoreFromBrand from "./MoreFromBrand";
import YouMightLike from "./YouMightLike";
import Marquee from "@/components/home/Marquee";
import ImageModal from "./ImageModal";
import ImageSkeleton from "@/components/common/ImageSkeleton";

type ProductDetailProps = {
  product: ProductDetailType;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    allImages,
    selectedImage,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    openAccordion,
    setOpenAccordion,
    openSubAccordion,
    setOpenSubAccordion,
    whole,
    decimal,
    relatedProducts,
    isLoadingRelated,
    youMightLikeProducts,
    isLoadingYouMightLike,
    isImageModalOpen,
    setIsImageModalOpen,
    mainImageLoading,
    thumbnailLoadingStates,
    modalImageLoading,
    handleMainImageLoad,
    handleThumbnailLoad,
    handleModalImageLoad,
    handleThumbnailLoadingStart,
    selectedModalImage,
  } = useProductDetail(product);

  return (
    <section>
      <div className="grid max-md:gap-6 md:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative flex items-start gap-2 max-xl:flex-col md:px-6 md:py-12 lg:mx-auto xl:gap-4">
            {/* Main Image */}
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="group relative w-full cursor-zoom-in"
              aria-haspopup="dialog"
              aria-expanded={isImageModalOpen}
            >
              {selectedImage && (
                <>
                  {mainImageLoading && (
                    <div className="absolute inset-0 z-20 md:rounded-3xl">
                      <ImageSkeleton 
                        className="h-[400px] w-full sm:h-[470px] lg:h-[780px]" 
                        rounded={true}
                        fullWidth={true}
                        fullHeight={true}
                      />
                    </div>
                  )}
                  <Image
                    className={`relative z-10 h-[400px] w-full object-cover sm:h-[470px] md:rounded-3xl lg:h-[780px] ${mainImageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                    src={selectedImage}
                    alt={product.name}
                    width={700}
                    height={780}
                    unoptimized
                    onLoad={handleMainImageLoad}
                    onLoadingComplete={handleMainImageLoad}
                  />
                </>
              )}
              <div className="absolute right-4 bottom-4 z-10 text-white/50 transition-all group-hover:scale-125 group-hover:text-white">
                <ZoomIn className="w-6 h-6" />
              </div>
              {/* Badge */}
              {(product.new || product.hot) && (
                <div className="pointer-events-none absolute top-2 left-3 z-10">
                  <div className="w-16 h-16 sm:w-[90px] sm:h-[90px]">
                    {(product.new || product.hot) && (
                      <div className="flex">
                        {product.new && <New />}
                        {product.hot && (
                          <div className={product.new ? "-ml-8 z-[5]" : ""}>
                            <Hot />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-auto max-xl:pb-2 max-md:px-3 xl:order-first xl:flex-col">
                {allImages.map((imageData, index) => {
                  const isLoading = thumbnailLoadingStates[index] !== false;
                  const thumbnailUrl = imageData.small_pic_link;
                  return (
                    <button
                      key={imageData.id || index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        handleThumbnailLoadingStart(index);
                      }}
                      className={`relative aspect-square shrink-0 cursor-pointer rounded-2xl border-[3px] transition-all overflow-hidden ${selectedImageIndex === index ? "border-black" : "border-transparent hover:border-black"
                        }`}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 z-10 rounded-xl">
                          <ImageSkeleton 
                            className="h-full w-full" 
                            rounded={false}
                            fullWidth={true}
                            fullHeight={true}
                          />
                        </div>
                      )}
                      <Image
                        className={`aspect-square w-full rounded-xl object-cover max-lg:h-20 max-lg:w-20 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                        src={thumbnailUrl}
                        alt={`${product.name} - Image ${index + 1}`}
                        width={100}
                        height={100}
                        unoptimized
                        onLoad={() => handleThumbnailLoad(index)}
                        onLoadingComplete={() => handleThumbnailLoad(index)}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-12 md:pl-14">
          <div>
            <h1 className="font-price-check text-4xl leading-[80%] font-stretch-expanded md:text-6xl">
              {product.name}
            </h1>
            <div className="pt-4">
              <Link
                href={`/collections/${product.category_name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-lg tracking-wide underline-offset-4 hover:underline"
              >
                {product.brand}
              </Link>
            </div>
            <div className="flex items-center gap-2 pt-10">
              <div className="flex text-right font-reika-script text-[56px] leading-none">
                <span className="text-[30px] leading-none">$</span> {whole}
                <span className="text-[30px] leading-none">.{decimal}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose pt-10 text-black md:text-lg prose-p:text-black prose-p:md:text-lg">
            <p>
              {isDescriptionExpanded
                ? product.description
                : product.description.split(" ").slice(0, 30).join(" ") + (product.description.split(" ").length > 30 ? "..." : "")}
            </p>
            {product.description && product.description.split(" ").length > 30 && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 rounded font-trade-gothic text-lg font-semibold text-black uppercase underline underline-offset-6 hover:underline"
              >
                {isDescriptionExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4 max-xs:flex-col">
              <div className="flex h-12 items-center justify-center gap-3 rounded-full border-2 border-black bg-white px-6 shadow-3d max-xs:w-full max-xs:gap-10">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex cursor-pointer items-center justify-center rounded-l-full hover:text-pop-red-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="flex h-12 items-center justify-center font-trade-gothic font-semibold sm:text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.current_stock}
                  className="flex cursor-pointer items-center justify-center rounded-r-full hover:text-pop-red-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={quantity > product.current_stock}
                className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-2 border-black px-8 font-trade-gothic font-black tracking-wide text-white uppercase shadow-[2px_2px_0px_0px_#000] transition-all sm:text-lg md:text-sm lg:text-xl ${
                  quantity > product.current_stock
                    ? "bg-gray-400 hover:bg-gray-400 disabled:cursor-not-allowed"
                    : "bg-pop-red-accent hover:bg-pop-teal-mid disabled:cursor-not-allowed disabled:bg-gray-400"
                }`}
              >
                {quantity > product.current_stock ? (
                  "Not enough stock"
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="relative mt-10 overflow-hidden">
            <div className="divide-y divide-dashed bg-pop-yellow-mid px-6">
              <div className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0">
                    <Image decoding="async"
                      src="https://cdn.sanity.io/images/q52u2xck/production/37100b94f61ce580475306220bfc3ba83753639d-100x100.svg?w=56&amp;h=56&amp;auto=format"
                      height="56"
                      width="56"
                      alt="POP Canberra"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
                  </div>
                  <div>
                    <h3 className="flex-1 text-sm font-semibold sm:text-lg">Pick up at POP Canberra</h3>
                    <div className="prose flex-1 text-sm text-black prose-a:text-black prose-a:underline prose-strong:font-semibold">
                      <p>Usually ready in 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0">
                    <Image
                      decoding="async"
                      src="https://cdn.sanity.io/images/q52u2xck/production/1fc3482b0420b62c625886ebae5ce7b591937bc6-100x100.svg?w=56&amp;h=56&amp;auto=format"
                      height="56"
                      width="56"
                      alt="POP Points"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
                  </div>
                  <div>
                    <h3 className="flex-1 text-sm font-semibold sm:text-lg">Earn POP Points with every purchase</h3>
                    <div className="prose flex-1 text-sm text-black prose-a:text-black prose-a:underline prose-strong:font-semibold">
                      <p>
                        <a href="https://poplocal.com.au/loyalty">Learn more</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-2.5 -left-2.5 h-6 w-6 rounded-full bg-pop-yellow-light"></div>
            <div className="absolute -bottom-2.5 -left-2.5 h-6 w-6 rounded-full bg-pop-yellow-light"></div>
            <div className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-pop-yellow-light"></div>
            <div className="absolute -right-2.5 -bottom-2.5 h-6 w-6 rounded-full bg-pop-yellow-light"></div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-10 rounded-2xl border-2 border-pop-neutral-black bg-white">
            <div className="w-full divide-y-2 divide-dashed">
              {/* Shipping & Orders */}
              <div className="group px-4">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")}
                  className="flex w-full flex-1 cursor-pointer items-center justify-between py-4 font-trade-gothic leading-4 font-extrabold tracking-wide uppercase transition-all select-none sm:text-lg"
                >
                  <span className="w-full text-left">Shipping & Orders</span>
                  <span className="hover:bg-gray-100 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent">
                    <ChevronDown
                      className={`size-6 rounded-md bg-pop-neutral-black p-1 text-white transition-transform duration-200 ${openAccordion === "shipping" ? "rotate-180" : ""
                        }`}
                    />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === "shipping"
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-2">
                    <div className="w-full">
                      <div className="group border-b border-gray-200 py-3 first:pt-0 last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubAccordion(openSubAccordion === "shipping-options" ? null : "shipping-options")
                          }
                          className="flex w-full flex-1 cursor-pointer items-center justify-between font-trade-gothic font-black tracking-wide uppercase transition-all select-none"
                        >
                          <span className="w-full text-left">What are the shipping options and delivery times?</span>
                          <span className="hover:bg-gray-100 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent">
                            <ChevronDown
                              className={`size-[14px] transition-transform duration-200 ${openSubAccordion === "shipping-options" ? "rotate-180" : ""
                                }`}
                            />
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubAccordion === "shipping-options"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div>
                            <div className="prose py-3 text-black prose-a:font-semibold prose-strong:font-semibold">
                              <p>
                                We offer standard shipping across Australia. Shipping usually takes 3-7 business,
                                depending on your location. We send all orders the following day after the order is
                                placed.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="group border-b border-gray-200 py-3 first:pt-0 last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubAccordion(openSubAccordion === "track-order" ? null : "track-order")
                          }
                          className="flex w-full flex-1 cursor-pointer items-center justify-between font-trade-gothic font-black tracking-wide uppercase transition-all select-none"
                        >
                          <span className="w-full text-left">How can I track my order?</span>
                          <span className="hover:bg-gray-100 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent">
                            <ChevronDown
                              className={`size-[14px] transition-transform duration-200 ${openSubAccordion === "track-order" ? "rotate-180" : ""
                                }`}
                            />
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubAccordion === "track-order"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div>
                            <div className="prose py-3 text-black prose-a:font-semibold prose-strong:font-semibold">
                              <p>
                                Once your order is dispatched, you will receive a tracking number via email. You can use
                                this number to track your package on the carrier's website. If you haven't received a
                                tracking number, please check your spam folder or contact us at hello@poplocal.com.au.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="group border-b border-gray-200 py-3 first:pt-0 last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubAccordion(openSubAccordion === "gift-wrapping" ? null : "gift-wrapping")
                          }
                          className="flex w-full flex-1 cursor-pointer items-center justify-between font-trade-gothic font-black tracking-wide uppercase transition-all select-none"
                        >
                          <span className="w-full text-left">Do you offer gift wrapping?</span>
                          <span className="hover:bg-gray-100 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent">
                            <ChevronDown
                              className={`size-[14px] transition-transform duration-200 ${openSubAccordion === "gift-wrapping" ? "rotate-180" : ""
                                }`}
                            />
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubAccordion === "gift-wrapping"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div>
                            <div className="prose py-3 text-black prose-a:font-semibold prose-strong:font-semibold">
                              <p>
                                Yes, we offer gift wrapping options at checkout. If you check this box we'll ensure your
                                order arrives beautifully wrapped and ready to delight the recipient.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns & Refunds */}
              <div className="group px-4">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "returns" ? null : "returns")}
                  className="flex w-full flex-1 cursor-pointer items-center justify-between py-4 font-trade-gothic leading-4 font-extrabold tracking-wide uppercase transition-all select-none sm:text-lg"
                >
                  <span className="w-full text-left">Returns & Refunds</span>
                  <span className="hover:bg-gray-100 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent">
                    <ChevronDown
                      className={`size-6 rounded-md bg-pop-neutral-black p-1 text-white transition-transform duration-200 ${openAccordion === "returns" ? "rotate-180" : ""
                        }`}
                    />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === "returns"
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-2">
                    <div className="w-full">
                      <div className="group border-b border-gray-200 py-3 first:pt-0 last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubAccordion(openSubAccordion === "return-policy" ? null : "return-policy")
                          }
                          className="flex w-full flex-1 cursor-pointer items-center justify-between font-trade-gothic font-black tracking-wide uppercase transition-all select-none"
                        >
                          <span className="w-full text-left">What is your return policy?</span>
                          <span className="hover:bg-gray-100 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent">
                            <ChevronDown
                              className={`size-[14px] transition-transform duration-200 ${openSubAccordion === "return-policy" ? "rotate-180" : ""
                                }`}
                            />
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubAccordion === "return-policy"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div>
                            <div className="prose py-3 text-black prose-a:font-semibold prose-strong:font-semibold">
                              <p>
                                We want you to be completely satisfied with your purchase. Items can be returned within
                                14 days of delivery, provided they are unused, in their original packaging, and in
                                resalable condition.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="group border-b border-gray-200 py-3 first:pt-0 last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubAccordion(openSubAccordion === "sale-items" ? null : "sale-items")
                          }
                          className="flex w-full flex-1 cursor-pointer items-center justify-between font-trade-gothic font-black tracking-wide uppercase transition-all select-none"
                        >
                          <span className="w-full text-left">Are sale items eligible for return?</span>
                          <span className="hover:bg-gray-100 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent">
                            <ChevronDown
                              className={`size-[14px] transition-transform duration-200 ${openSubAccordion === "sale-items" ? "rotate-180" : ""
                                }`}
                            />
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubAccordion === "sale-items"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div>
                            <div className="prose py-3 text-black prose-a:font-semibold prose-strong:font-semibold">
                              <p>
                                Only regular-priced items are eligible for refunds. Sale or discounted items are final
                                sale and cannot be refunded for change of mind. Customers retain all of their exchange
                                rights for damaged or faulty goods under Australian Consumer Law.
                                <br />
                                <br />
                                For a full list of FAQs, check out{" "}
                                <a href="https://www.poplocal.com.au/faqs/">this</a>!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Marquee />

      {/* More From Brand Section */}
      <MoreFromBrand
        products={relatedProducts}
        isLoading={isLoadingRelated}
        brand={product.brand}
        categorySlug={product.category_name.toLowerCase().replace(/\s+/g, "-")}
      />

      {/* You Might Like Section */}
      <YouMightLike
        products={youMightLikeProducts}
        isLoading={isLoadingYouMightLike}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedModalImage}
        alt={product.name}
        isLoading={modalImageLoading}
        onImageLoad={handleModalImageLoad}
      />
    </section>
  );
}
