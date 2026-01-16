"use client";

import GreenDivider from "@/assets/green-divider.svg";
import GreenBackground from "@/assets/green-background.svg";

type InstagramPost = {
  href: string;
  imageUrl: string;
  alt: string;
};

const instagramPosts: InstagramPost[] = [
  {
    href: "https://www.instagram.com/p/DS7S4JiEr0z/",
    imageUrl:
      "https://imgs.growave.io/tSdv8Tmf3lKuFXpeip-cWkCQGYjD3uEuVIYlo2Lnkdo/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMzExMjAwMTZfMGZiMGFiNjItZjlhNC00NjcyLWI0NmMtMzIzNGUzZDg2YzdlLmpwZw",
    alt: "\"That's a wrap! Thanks for loving local with us! Let's do it all again in 2026.... and much more 😱\n\nHappy New Year 💛\"",
  },
  {
    href: "https://www.instagram.com/p/DSs1oo0EwP9/",
    imageUrl:
      "https://imgs.growave.io/sYOE0KT-iHbgvc9vkvvuOllz9sM2-ULCmI1VDvfEQEM/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjUyMDU5NDhfOGE5ZWExZjUtMjVmYS00ZWM5LWE5NWQtZWJiYWQzZjYyOTE5LmpwZw",
    alt: "\"Can't make it to Woden for our big 30% off popping down sale, but want to enjoy some Northside or Australia wide festive cheer?!?⁠\n⁠\nWe've got 25% off all Christmas goodies online and in Braddon today!! ⁠\n⁠\nSuper limited numbers of Christmas treats to keep the festive vibes alive 🎉\"",
  },
  {
    href: "https://www.instagram.com/p/DSsv6UIk_AS/",
    imageUrl:
      "https://imgs.growave.io/xIv3RtEIDVdiyvGNJuf2rwMAUOBrdUXhCbkDgRt_6AM/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjUyMDE1MjBfZGMyOGMyYjEtM2RlZi00OTgxLWE5NjAtZjBhOWZmZTAxZmM5LmpwZw",
    alt: "\"Seeya round Woden!⁠\n⁠\nWe're packing up and heading back over the bridge. ⁠\n⁠\nTo say thanks for all the fun times \u0026 good vibes, we're giving you 30% off EVERYTHING at our Woden POP up until we close on Sunday night.⁠\n⁠\nSo many goodies to grab!\"",
  },
  {
    href: "https://www.instagram.com/reel/DSo866zDyzA/",
    imageUrl:
      "https://imgs.growave.io/5hSjNJNCvZAl8oOK9f0Kd1f5rgiVL8HqkWK8PZb4otc/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjQwOTAwNTVfN2JkYTY0NzMtZWFlNS00ZWYwLWE5NDEtMDQyMTJmZTM1ZjBkLmpwZw",
    alt: "\"THANK YOU 🩵\n\nYour support has been incredible this year and we are so grateful for each and every one of you. This is a real community, and together we are doing something great.\n\nMerry Christmas to you and yours from all of us at POP.\n\nOh, and you’ll want to watch this video to the end. Let’s just say, Will lost a bet and he did NOT disappoint.\"",
  },
  {
    href: "https://www.instagram.com/p/DSj0EsBjtXj/",
    imageUrl:
      "https://imgs.growave.io/Ptw_tD_wr8Pn0TPefJdt_ukqv1fmzFrgOYYCUJq1e8w/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjIwOTAwMjdfYzRkMjJhMTctYzExNS00YzkwLWI1MmUtZjBiMzE0Nzk4YTcyLmpwZw",
    alt: "\"For our final 12 days of Xmas fun, we're refunding one of your orders!⁠\n⁠\nEvery purchase between the 12th and 23rd of December is in the running to be fully refunded. Shop in-store or online until 5pm on Tuesday the 23rd of December, and you’re automatically in the draw.⁠\n⁠\nThanks for supporting local like never before 🩵⁠\"",
  },
];

export default function InstagramFeed() {
  return (
    <div>
      <div className="relative h-6 overflow-hidden border-t-2 border-b-2 border-black">
        <div className="absolute top-0 left-0">
          <GreenDivider />
        </div>
      </div>
      <section className="relative overflow-hidden bg-[var(--pop-green-mid)] px-6 py-12 md:py-16">
        <div className="relative z-10 flex items-center justify-between gap-3 max-sm:flex-col">
          <h2 className="mt-2 text-4xl text-[var(--pop-yellow-light)] sm:text-[56px] font-reika-script">Follow Us</h2>
          <a
            href="https://www.instagram.com/popcanberra/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-white text-black hover:bg-[var(--pop-teal-mid)] hover:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            @POPCANBERRA
          </a>
        </div>
        <div className="relative z-10 mt-10 grid grid-cols-3 gap-2 md:grid-cols-5">
          {instagramPosts.map((post, index) => (
            <a
              key={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-xl md:rounded-3xl ${index >= 3 ? "hidden md:block" : ""}`}
              href={post.href}
            >
              <img
                className="!h-36 !w-full object-cover md:!h-[400px]"
                loading="lazy"
                src={post.imageUrl}
                alt={post.alt}
              />
              <div className="absolute inset-0 flex items-end bg-black/50 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-3 text-sm text-white">{post.alt}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="absolute top-0 left-0 h-full w-full">
          <GreenBackground />
        </div>
      </section>
    </div>
  );
}
