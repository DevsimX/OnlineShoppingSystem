"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrders, type Order } from "@/lib/api/orders";

type OrderHistoryProps = {
  showTitle?: boolean;
  limit?: number; // For dashboard, show limited orders
};

export default function OrderHistory({ showTitle = true, limit }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const pageSize = limit || 10;
        const response = await getOrders(currentPage, pageSize);
        setOrders(response.results || []);
        setTotalCount(response.count || 0);
        setNextPage(response.next);
        setPreviousPage(response.previous);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // For any error (including auth), show empty state
        // The account page's useAuth will handle redirect if needed
        setOrders([]);
        setTotalCount(0);
        setNextPage(null);
        setPreviousPage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "processing":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Empty state
  if (!isLoading && orders.length === 0) {
    return (
      <div>
        {showTitle && (
          <h3 className="font-reika-script text-4xl md:text-6xl">Recent Orders</h3>
        )}
        <div className="rounded-3xl border-2 bg-white p-12 text-center shadow-3d">
          <div className="mx-auto max-w-md space-y-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pop-yellow-mid">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h4 className="font-price-check text-2xl font-stretch-expanded">No Orders Yet</h4>
            <p className="text-lg font-semibold text-black/70">
              You haven&apos;t placed any orders yet. Start shopping to see your order history here!
            </p>
            <Link
              href="/collections"
              className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
            >
              Start Shopping
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                className="h-5 w-5 ml-2"
              >
                <path
                  d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <h3 className="font-reika-script text-4xl md:text-6xl">Recent Orders</h3>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6 pt-6">
          <div className="mr-1 mb-1 overflow-auto rounded-3xl border-2 border-black shadow-3d">
            <table className="w-full overflow-auto">
              <thead className="bg-pop-yellow-mid">
                <tr>
                  <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                    Shipping
                  </th>
                  <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className={i > 1 ? "border-t-2 border-dashed" : ""}>
                    <td className="px-6 py-4">
                      <div className="skeleton-loader h-6 w-20 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton-loader h-6 w-16 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton-loader h-6 w-24 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton-loader h-6 w-12 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton-loader h-6 w-12 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="space-y-6 pt-6">
            <div className="mr-1 mb-1 overflow-auto rounded-3xl border-2 border-black shadow-3d">
              <table className="w-full overflow-auto">
                <thead className="bg-pop-yellow-mid">
                  <tr>
                    <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                      Shipping
                    </th>
                    <th className="px-6 py-4 text-left font-family-trade-gothic text-lg font-black tracking-wide text-black uppercase">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={index > 0 ? "border-t-2 border-dashed" : ""}
                    >
                      <td className="px-6 py-4">{formatDate(order.date)}</td>
                      <td className="px-6 py-4">{formatPrice(order.total)}</td>
                      <td className={`px-6 py-4 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </td>
                      <td className="px-6 py-4">{order.shipping}</td>
                      <td className="px-6 py-4">
                        <button className="text-pop-red-accent hover:underline font-semibold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Only show if not limited (i.e., not in dashboard) */}
          {!limit && totalCount > 0 && (
            <div className="flex items-center justify-between gap-4 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!previousPage}
                className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-10 px-4 py-2 text-sm rounded-full"
              >
                Previous
              </button>
              <span className="font-family-trade-gothic text-sm font-semibold">
                Page {currentPage} of {Math.ceil(totalCount / 10)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!nextPage}
                className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-10 px-4 py-2 text-sm rounded-full"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
