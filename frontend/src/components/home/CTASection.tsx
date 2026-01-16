import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTACard = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  mobileImageUrl: string;
};

const ctaCards: CTACard[] = [
  {
    title: "Visit our store",
    description: "Pop into our store that started it all and see what all the fuss is about.",
    ctaText: "Find us",
    ctaHref: "/visit",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/23908fec8d6cffc5cce0c7d4e3c9666c7b4400b3-360x400.svg?h=400&auto=format",
    imageAlt: "Visit our store illustration",
    mobileImageUrl: "https://cdn.sanity.io/images/q52u2xck/production/bf2b06c7339b28e691160929eb8e91a085f463b9-952x714.png?h=400&auto=format",
  },
  {
    title: "Become a seller",
    description: "Showcase your goods at POP and join our community of makers.",
    ctaText: "Learn more",
    ctaHref: "/seller",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/0cfd99f88011975179b0052cda5166dd339d1df2-360x400.svg?h=400&auto=format",
    imageAlt: "Become a seller illustration",
    mobileImageUrl: "https://cdn.sanity.io/images/q52u2xck/production/b991b11fab194a529bc7090583067c833a9074ed-952x714.png?h=400&auto=format",
  },
];

export default function CTASection() {
  return (
    <section className="grid gap-6 border-t-2 px-6 py-12 sm:grid-cols-2 md:py-16">
      {ctaCards.map((card) => (
        <div
          key={card.ctaHref}
          className="grid items-center rounded-4xl border-2 bg-[var(--pop-yellow-mid)] max-lg:text-center lg:grid-cols-2"
        >
          <div className="space-y-4 px-6 py-6 max-lg:pb-10 lg:px-10">
            <h3 className="text-2xl leading-[0.9] font-price-check font-stretch-expanded md:text-4xl">{card.title}</h3>
            <p className="text-lg md:text-xl">{card.description}</p>
            <div className="flex max-lg:justify-center">
              <Link
                href={card.ctaHref}
                className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
              >
                {card.ctaText}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
          <div className="order-first lg:order-last lg:ml-auto max-lg:mx-auto">
            <img
              src={card.mobileImageUrl}
              alt={card.imageAlt}
              height="400"
              loading="lazy"
              decoding="async"
              className="w-full h-auto block lg:hidden"
            />
            <img
              src={card.imageUrl}
              alt={card.imageAlt}
              height="400"
              loading="lazy"
              decoding="async"
              className="w-full h-auto hidden lg:block"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
