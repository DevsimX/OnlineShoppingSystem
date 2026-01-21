"use client";

import { type LoginResponse } from "@/lib/api/auth";
import Candy from "@/assets/candy.svg";
import OrderHistory from "./OrderHistory";

type AccountTab = "dashboard" | "order-history" | "points-activity" | "account-details";

type DashboardProps = {
  user: LoginResponse["user"];
  onTabChange: (tab: AccountTab) => void;
};

export default function Dashboard({ onTabChange }: DashboardProps) {
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
                <div className="flex flex-col items-center justify-between gap-4 max-md:hidden">
                  <button
                    onClick={() => onTabChange("points-activity")}
                    className="font-ultra-bold flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
                  >
                    Redeem Points
                  </button>
                  <a href="/loyalty" className="text-sm font-semibold underline underline-offset-2">
                    How it works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-6 md:hidden">
          <button
            onClick={() => onTabChange("points-activity")}
            className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
          >
            Redeem Points
          </button>
          <a href="/loyalty" className="text-sm font-semibold underline underline-offset-2">
            How it works
          </a>
        </div>
      </div>

      {/* Recent Orders Section */}
      <OrderHistory showTitle={true} limit={5} />
    </>
  );
}
