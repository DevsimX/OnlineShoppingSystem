import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/lib/api/products";
import SparkleDecorations from "./SparkleDecorations";
import ProductBadges from "./ProductBadges";
import PriceDisplay from "./PriceDisplay";

type ProductCardProps = {
  product: Product;
  href: string;
  showBrand?: boolean;
};

export default function ProductCard({ product, href, showBrand = true }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex w-full cursor-pointer flex-col text-left"
    >
      <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
        {product.profile_pic_link ? (
          <Image
            width={300}
            height={300}
            loading="lazy"
            className="aspect-square h-full w-full rounded-2xl object-cover sm:rounded-[22px]"
            src={product.profile_pic_link}
            alt={product.name}
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
            {showBrand && (
              <span className="pt-2 text-sm leading-tight tracking-wide text-black sm:text-lg">
                {product.brand}
              </span>
            )}
          </div>
          <div>
            <PriceDisplay price={product.price} className="sm:text-right" />
          </div>
        </div>
      </div>
    </Link>
  );
}
