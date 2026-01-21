"use client";
import Candy from "@/assets/candy.svg";

export default function PointsActivity() {
  const redeemOptions = [
    { amount: 5, points: 280 },
    { amount: 10, points: 540 },
    { amount: 20, points: 1000 },
    { amount: 40, points: 1500 },
    { amount: 60, points: 2200 },
    { amount: 1000, points: 15000 },
  ];

  return (
    <>
      {/* Points Section */}
      <div>
        <div className="rounded-3xl border-2 bg-pop-yellow-mid px-3 py-4 shadow-3d md:p-6">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <Candy />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-price-check text-lg leading-none font-stretch-expanded md:text-3xl">
                    Points collected
                  </h3>
                  <h4 className="mt-4 font-reika-script text-4xl text-pop-red-accent md:text-6xl">0</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Points Section */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6">
          <h3 className="font-reika-script text-4xl md:text-6xl">Redeem Points</h3>
          <a href="/loyalty" className="text-sm font-semibold underline underline-offset-2">
            How it works
          </a>
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:gap-x-10">
            {redeemOptions.map((option) => (
              <button
                key={option.amount}
                disabled
                className="cursor-pointer rounded-xl bg-contain bg-center bg-no-repeat px-4 py-4 text-center xl:py-10 cursor-not-allowed bg-[url(/assets/redeem-button-disabled.svg)] opacity-50"
              >
                <div className="flex items-start justify-center gap-1 text-center font-price-check text-xl font-stretch-expanded sm:gap-2 xl:text-3xl">
                  $ <div className="text-4xl sm:text-5xl xl:text-7xl">{option.amount}</div>{" "}
                  <div className="pt-2 sm:pt-3 xl:pt-5">OFF</div>
                </div>
                <div className="mt-1 font-family-trade-gothic font-semibold xl:text-xl">
                  {option.points.toLocaleString()} PTS
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
