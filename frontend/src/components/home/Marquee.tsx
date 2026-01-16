import Smile from "@/assets/smile.svg";

type MarqueeItem = {
  text: string;
};

const marqueeItems: MarqueeItem[] = [
  { text: "Pick up and delivery" },
  { text: "Free shipping over $100" },
  { text: "Earn rewards" },
  { text: "All local goods" },
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden bg-black py-2 font-extrabold text-[var(--pop-yellow-mid)] uppercase md:text-lg">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
          <div key={index} className="inline-flex items-center gap-4 px-4 whitespace-nowrap">
            <Smile />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
