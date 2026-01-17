import Image from "next/image";

type AboutIntroProps = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export default function AboutIntro({ title, description, imageUrl, imageAlt }: AboutIntroProps) {
  return (
    <section className="py-12">
      <div className="px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-6 md:order-2">
            <h2 className="font-reika-script text-4xl md:text-5xl">{title}</h2>
            <div className="space-y-4">
              <p className="md:text-2xl md:leading-[1.33] sm:text-xl sm:leading-[1.4] text-lg leading-[1.56]">
                {description}
              </p>
            </div>
          </div>
          <div className="relative max-sm:order-first md:order-first">
            <div>
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={680}
                height={680}
                className="h-auto w-full object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
