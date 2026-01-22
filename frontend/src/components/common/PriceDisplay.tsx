import { formatPrice } from "@/lib/utils";

type PriceDisplayProps = {
  price: string | number;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-xl",
  md: "text-[32px]",
  lg: "text-4xl",
};

export default function PriceDisplay({ price, className = "", size = "md" }: PriceDisplayProps) {
  const { whole, decimal } = formatPrice(price);
  const sizeClass = sizeClasses[size];

  return (
    <span className={`flex font-reika-script ${sizeClass} leading-none text-black ${className}`}>
      <span className="text-[20px] leading-none">$</span> {whole}{" "}
      <span className="text-[20px] leading-none">.{decimal}</span>
    </span>
  );
}
