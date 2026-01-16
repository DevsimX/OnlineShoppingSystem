import DividerGreen2 from "@/assets/divider-green2.svg";

type PageHeroProps = {
  firstLine: string;
  secondLine: string;
};

export default function PageHero({ firstLine, secondLine }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--pop-red-accent)]">
      <div className="relative z-20 py-20 md:py-28 lg:py-40">
        <div className="px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:gap-12">
            <div className="text-center order-last lg:order-none">
              <h1 className="text-5xl sm:text-7xl lg:text-[120px] md:pt-0">
                <span className="relative z-10 block font-reika-script leading-[0.35] text-[var(--pop-yellow-mid)]">
                  {firstLine}
                </span>
                <span className="font-price-check leading-[85%] text-[var(--pop-yellow-light)] font-stretch-expanded lg:leading-[85%]">
                  {secondLine}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-full rotate-180 border-t-2 border-b-2">
        <DividerGreen2 />
      </div>
    </section>
  );
}
