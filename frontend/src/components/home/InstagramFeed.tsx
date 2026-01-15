"use client";

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
    alt: "That's a wrap! Thanks for loving local with us!",
  },
  {
    href: "https://www.instagram.com/p/DSs1oo0EwP9/",
    imageUrl:
      "https://imgs.growave.io/sYOE0KT-iHbgvc9vkvvuOllz9sM2-ULCmI1VDvfEQEM/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjUyMDU5NDhfOGE5ZWExZjUtMjVmYS00ZWM5LWE5NWQtZWJiYWQzZjYyOTE5LmpwZw",
    alt: "Can't make it to Woden for our big 30% off popping down sale",
  },
  {
    href: "https://www.instagram.com/p/DSsv6UIk_AS/",
    imageUrl:
      "https://imgs.growave.io/xIv3RtEIDVdiyvGNJuf2rwMAUOBrdUXhCbkDgRt_6AM/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjUyMDE1MjBfZGMyOGMyYjEtM2RlZi00OTgxLWE5NjAtZjBhOWZmZTAxZmM5LmpwZw",
    alt: "Seeya round Woden!",
  },
  {
    href: "https://www.instagram.com/reel/DSo866zDyzA/",
    imageUrl:
      "https://imgs.growave.io/5hSjNJNCvZAl8oOK9f0Kd1f5rgiVL8HqkWK8PZb4otc/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjQwOTAwNTVfN2JkYTY0NzMtZWFlNS00ZWYwLWE5NDEtMDQyMTJmZTM1ZjBkLmpwZw",
    alt: "THANK YOU",
  },
  {
    href: "https://www.instagram.com/p/DSj0EsBjtXj/",
    imageUrl:
      "https://imgs.growave.io/Ptw_tD_wr8Pn0TPefJdt_ukqv1fmzFrgOYYCUJq1e8w/q:80/rs:auto:320/aHR0cHM6Ly9ncm93YXZlLWluc3RhZ3JhbS5zMy5hbWF6b25hd3MuY29tL2luc3RhZ3JhbS1pbWFnZXMvcHJvZHVjdGlvbi9jbGllbnQxNTE0OTcvaW1hZ2VfMjAyNTEyMjIwOTAwMjdfYzRkMjJhMTctYzExNS00YzkwLWI1MmUtZjBiMzE0Nzk4YTcyLmpwZw",
    alt: "For our final 12 days of Xmas fun",
  },
];

export default function InstagramFeed() {
  return (
    <div>
      <div className="relative h-6 overflow-hidden border-t-2 border-b-2 border-black">
        <div className="absolute top-0 left-0">
          <svg
            className="w-full"
            width="1534"
            height="24"
            preserveAspectRatio="none"
            viewBox="0 0 1512 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_3164_4073)">
              <path d="M0 0H1512V24H0V0Z" fill="#30897C" />
            </g>
            <defs>
              <clipPath id="clip0_3164_4073">
                <path d="M0 0H1512V24H0V0Z" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <section className="relative overflow-hidden bg-[var(--pop-green-mid)] px-6 py-12 md:py-16">
        <div className="relative z-10 flex items-center justify-between gap-3 max-sm:flex-col">
          <h2 className="text-4xl text-[var(--pop-yellow-light)] sm:text-[56px]">Follow Us</h2>
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
          {instagramPosts.map((post) => (
            <a
              key={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl md:rounded-3xl"
              href={post.href}
            >
              <img
                className="h-36 w-full object-cover md:h-[400px]"
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
        <div className="absolute top-0 left-0 h-full w-full opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1024 467" fill="none">
            <g opacity="0.1">
              {Array.from({ length: 40 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={9.75 + i * 24}
                  y1="-549.056"
                  x2={9.75 + i * 24}
                  y2="1014.66"
                  stroke="#60BB8F"
                  strokeWidth="1.5"
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="1294"
                  y1={18.752 + i * 24}
                  x2="-269.715"
                  y2={18.752 + i * 24}
                  stroke="#60BB8F"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          </svg>
        </div>
      </section>
    </div>
  );
}
