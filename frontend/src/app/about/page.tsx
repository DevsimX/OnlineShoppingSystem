import PageHero from "@/components/PageHero";
import InstagramFeed from "@/components/home/InstagramFeed";
import Marquee from "@/components/home/Marquee";
import CTASection from "@/components/home/CTASection";
import AboutIntro from "@/components/about/AboutIntro";
import AboutTeam from "@/components/about/AboutTeam";
import TimelineCarousel from "@/components/about/TimelineCarousel";

export default function AboutPage() {
  const timelineItems = [
    {
      year: "2018",
      title: "Launching Pop Local",
      description:
        "We launched POP as a 4-week pop-up in Canberra. What started small quickly blossomed into a vibrant community space supporting local creatives.",
      backgroundColor: "pop-green-mid" as const,
    },
    {
      year: "2019",
      title: "Our Second Pop-up",
      description:
        "In just one year, POP grew from featuring 40 makers to over 200, establishing itself as the place to go for local goods. We launched a second pop-up store and the buzz really got started.",
      backgroundColor: "pop-red-mid" as const,
    },
    {
      year: "2020",
      title: "A permanent fixture",
      description:
        "We built our very first year-round store and started creating a powerful community that celebrated local every single day.",
      backgroundColor: "pop-blue-mid" as const,
    },
    {
      year: "2021",
      title: "Late night shopping",
      description:
        "POP introduced late-night shopping, offering a unique, fun experience that made supporting local even more exciting.",
      backgroundColor: "pop-teal-mid" as const,
    },
    {
      year: "2022",
      title: "300th Maker",
      description:
        "We turned 4 and celebrated by welcoming our 300th maker in-store! We clocked over 5000 local products and started running regular tastings and events.",
      backgroundColor: "pop-green-mid" as const,
    },
    {
      year: "2023",
      title: "POP Points",
      description:
        "We launched our POP Points program and really dialled up the local love! We kept growing, soaring over 300 makers and surpassing 7000 products in-store.",
      backgroundColor: "pop-red-mid" as const,
    },
    {
      year: "2024",
      title: "New Look",
      description:
        "POP has rebranded with a fresh, new look! We've announced plans to expand across Australia and launched our online store, offering shopping and delivery Australia-wide.",
      backgroundColor: "pop-blue-mid" as const,
    },
  ];

  return (
    <main className="">
      <PageHero firstLine="About" secondLine="POP LOCAL" />
      <AboutIntro
        title="What's POP?"
        description="POP is the answer to connecting local artists, creators and makers with like-minded customers. POP is a portal into a local shopping experience celebrating local, handmade, artisan products, all of which have been dreamt up, designed and made by local people."
        imageUrl="https://cdn.sanity.io/images/q52u2xck/production/f3d40e6525cdcb38ec079ac080c1c1a1ee16f306-1360x1360.png?w=680&auto=format"
        imageAlt="POP Store"
      />
      <AboutTeam
        title="Meet the Team"
        description="Gabe is the driving force who helps makers from all age groups and walks of life showcase their pieces in the funky, vibrant and fun world that is POP. With the highly valued support of POP's Operations Manager, Christa, the duo and their team of retail creatives are the unstoppable force that keep mediocrity at bay."
        imageUrl="https://cdn.sanity.io/images/q52u2xck/production/d082dba0dac6a524c3d3832d05006518dfadca7f-1360x1360.png?w=680&auto=format"
        imageAlt="POP Team"
      />
      <TimelineCarousel title="How It Began" items={timelineItems} />
      <CTASection />
      <InstagramFeed />
      <Marquee />
    </main>
  );
}


