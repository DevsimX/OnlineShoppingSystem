import InstagramFeed from "@/components/home/InstagramFeed";
import Marquee from "@/components/home/Marquee";
import PageHero from "@/components/PageHero";
import StoreLocation from "@/components/visit/StoreLocation";

export default function VisitPage() {
  return (
    <main>
      <PageHero firstLine="Pop In and" secondLine="Say Hello" />
      <StoreLocation
        locationName="Canberra"
        address="27 Lonsdale St, Braddon ACT"
        openingHours={[
          "Monday - 10am-6pm",
          "Tuesday - 10am-6pm",
          "Wednesday - 10am - 6pm",
          "Thursday - 10am-9pm",
          "Friday - 8am-9pm",
          "Saturday - 9am-9pm",
          "Sunday - 9am-5pm",
        ]}
        mapLink="https://maps.app.goo.gl/S5oo43BHJ4nGqqos8"
        imageUrl="https://cdn.sanity.io/images/q52u2xck/production/e3ba0fd87b70ade37ca4e57accff56d4b7846274-1360x1360.png?w=680&auto=format"
        imageAlt="POP Canberra Shop"
      />
      <InstagramFeed />
      <Marquee />
    </main>
  );
}


