import Hot from "@/assets/hot.svg";
import New from "@/assets/new.svg";

type ProductBadgesProps = {
  isNew?: boolean;
  isHot?: boolean;
};

export default function ProductBadges({ isNew, isHot }: ProductBadgesProps) {
  if (!isNew && !isHot) return null;

  return (
    <div className="pointer-events-none absolute -top-4 -left-3 z-[2] sm:-top-5 flex">
      {isNew && <New />}
      {isHot && (
        <div className={isNew ? "-ml-8 z-[5]" : ""}>
          <Hot />
        </div>
      )}
    </div>
  );
}
