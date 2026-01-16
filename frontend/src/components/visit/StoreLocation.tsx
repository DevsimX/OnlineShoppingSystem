import Link from "next/link";
import RightArrow from "@/assets/right-arrow.svg";

type StoreLocationProps = {
  locationName: string;
  address: string;
  openingHours: string[];
  mapLink: string;
  imageUrl: string;
  imageAlt: string;
};

export default function StoreLocation({
  locationName,
  address,
  openingHours,
  mapLink,
  imageUrl,
  imageAlt,
}: StoreLocationProps) {
  return (
    <section className="py-12">
      <div className="px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-6 md:order-2">
            <h2 className="font-reika-script text-4xl md:text-5xl">{locationName}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl leading-[80%] md:text-4xl font-price-check md:leading-[85%] mb-[0.6em]">Address</h3>
                <p className="md:text-2xl md:leading-[1.33] sm:text-xl sm:leading-[1.4] text-lg leading-[1.56] mb-[2em]">{address}</p>
              </div>
              <div>
                <h3 className="text-2xl leading-[80%] md:text-4xl font-price-check md:leading-[85%] mb-[0.6em]">Opening Hours</h3>
                <ul className="list-disc list-inside space-y-1 md:text-2xl md:leading-[1.33] sm:text-xl sm:leading-[1.4] text-lg leading-[1.56]">
                  {openingHours.map((hours, index) => (
                    <li key={index} className="mb-[0.6em]">{hours}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex pt-4">
              <Link
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-14 px-8 py-2 text-lg md:text-xl rounded-full"
              >
                Lead the way
                <RightArrow />
              </Link>
            </div>
          </div>
          <div className="relative max-sm:order-first md:order-first">
            <div>
              <img
                src={imageUrl}
                alt={imageAlt}
                width="680"
                height="680"
                className="h-auto w-full object-center"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
