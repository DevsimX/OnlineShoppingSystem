import Link from "next/link";
import Image from "next/image";
import { type ProductCarouselProduct } from "@/hooks/useCollections";
import SparkleDecorations from "./SparkleDecorations";
import ProductBadges from "./ProductBadges";
import PriceDisplay from "./PriceDisplay";

type CollectionProductCardProps = {
  product: ProductCarouselProduct;
};

export default function CollectionProductCard({ product }: CollectionProductCardProps) {
  return (
    <Link
      href={product.href}
      className="group relative flex w-full cursor-pointer flex-col text-left"
    >
      <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
        {product.imageUrl ? (
          <Image
            width={300}
            height={300}
            loading="lazy"
            className="aspect-square h-full w-full rounded-2xl object-cover sm:rounded-[22px]"
            src={product.imageUrl}
            alt={product.imageAlt}
            unoptimized
          />
        ) : (
          <div className="aspect-square w-full rounded-2xl bg-gray-200 sm:rounded-[22px]" />
        )}

        <SparkleDecorations />
        <ProductBadges isNew={product.new} isHot={product.hot} />
      </div>

      <div className="space-y-3 pt-4 sm:pt-6">
        <div className="flex justify-between gap-2 max-sm:flex-col sm:gap-4">
          <div className="flex flex-col">
            <h3 className="font-price-check text-xl leading-[85%] font-normal wrap-anywhere text-black font-stretch-expanded sm:text-2xl">
              {product.name}
            </h3>
            {product.vendor && (
              <span className="pt-2 text-sm leading-tight tracking-wide text-black sm:text-lg">
                {product.vendor}
              </span>
            )}
          </div>
          {product.price && product.price.trim() !== "" && (
            <div>
              <PriceDisplay price={product.price} className="sm:text-right" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
