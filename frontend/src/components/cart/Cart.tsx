"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { X, Plus, Minus, Trash2, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import DialogOverlay from "@/components/common/DialogOverlay";
import BigCart from "@/assets/bigcart.svg";
import { updateCartItem, removeCartItem, createCheckoutSession, type CartItem } from "@/lib/api/cart";
import { formatPrice } from "@/lib/utils";
import { isAuthenticated } from "@/lib/api/auth";

const FREE_SHIPPING_THRESHOLD = 100;

function CartItemRow({ item }: { item: CartItem }) {
  const { refreshCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateCartItem(item.product_id, newQuantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to update cart item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      // Send product_id instead of item.id (sequential ID)
      await removeCartItem(item.product_id);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const itemTotal = formatPrice(item.subtotal);

  return (
    <div className="relative flex gap-4 py-6">
      <div className="relative h-12 w-12 overflow-hidden rounded-lg sm:mt-1 shrink-0">
        <Image
          src={item.product_image}
          alt={item.product_name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <button className="cursor-pointer text-left font-family-price-check text-lg leading-[0.8] font-stretch-expanded sm:text-xl truncate">
            {item.product_name}
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="ml-2 cursor-pointer p-1 text-black transition-colors hover:text-pop-red-accent disabled:opacity-50 shrink-0"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm">{item.brand_name}</p>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-3 rounded-full border-2 border-black bg-white px-3 shadow-3d">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={isUpdating || item.quantity <= 1}
              className="flex cursor-pointer items-center justify-center rounded-l-full hover:text-pop-red-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex h-8 items-center justify-center font-family-trade-gothic text-lg font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating}
              className="flex cursor-pointer items-center justify-center rounded-r-full hover:text-pop-red-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex font-reika-script">
            <span className="text-base">$</span>
            <span className="text-3xl">{itemTotal.whole}</span>
            <span className="text-base">.{itemTotal.decimal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { isCartOpen, closeCart, cart, isLoading } = useCart();
  const router = useRouter();
  const [giftWrap, setGiftWrap] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate free shipping progress
  const subtotal = cart ? parseFloat(cart.subtotal) : 0;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const itemCount = cart?.items.length || 0;
  const subtotalFormatted = formatPrice(cart?.subtotal || "0.00");

  // Reset note expansion when cart closes
  useEffect(() => {
    if (!isCartOpen) {
      setNoteExpanded(false);
    }
  }, [isCartOpen]);

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Show notification explaining why checkout is denied
      toast.error("Please sign in to proceed with checkout", {
        duration: 4000,
      });
      
      // Force user to sign in - store checkout intent and redirect to auth page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("checkout_intent", "true");
      }
      closeCart();
      router.push("/auth?redirect=/");
      return;
    }

    // User is authenticated - proceed with Stripe checkout
    setIsCheckingOut(true);
    try {
      const checkoutData = await createCheckoutSession(giftWrap, note);
      // Redirect to Stripe checkout page
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to start checkout. Please try again.";
      toast.error(errorMessage, {
        duration: 4000,
      });
      
      // If it's an auth error, redirect to login
      if (errorMessage.includes("session has expired") || errorMessage.includes("not authenticated")) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("checkout_intent", "true");
        }
        closeCart();
        router.push("/auth?redirect=/");
      }
      
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <DialogOverlay isOpen={isCartOpen} onClose={closeCart} />

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 z-[99999] h-full border-l-2 border-black bg-pop-yellow-light shadow-lg transition-all duration-500 ease-in-out ${
          isCartOpen
            ? "w-full lg:w-[400px] translate-x-0"
            : "w-0 translate-x-full overflow-hidden"
        }`}
        role="dialog"
        aria-modal="true"
        data-dialog-content=""
        tabIndex={-1}
        data-state={isCartOpen ? "open" : "closed"}
        style={{ pointerEvents: "auto", userSelect: "text" }}
      >
        <div className="h-full flex flex-col">
          <div className="flex h-full flex-col justify-between py-4">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b-2 px-6 pb-2 sm:pb-4">
              <div>
                <h2 className="font-display font-reika-script text-3xl">My Cart</h2>
                {itemCount > 0 && (
                  <p className="text-sm text-black">
                    {isLoading ? "Loading..." : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
                  </p>
                )}
              </div>
              <button
                className="IconMenu"
                onClick={closeCart}
                tabIndex={0}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : itemCount === 0 ? (
              /* Empty Cart */
              <div className="mt-auto flex w-full flex-col items-center justify-center overflow-hidden flex-1">
                <BigCart />
                <div className="mt-6 text-center font-price-check text-2xl font-stretch-expanded">
                  Your basket is empty
                </div>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress */}
                {amountNeeded > 0 ? (
                  <div className="mt-6 px-6">
                    <div className="space-y-3 rounded-xl p-3 ring-2 sm:p-4">
                      <div className="text-sm">
                        Add <span className="font-semibold">${amountNeeded.toFixed(2)}</span> more for{" "}
                        <span className="font-semibold">FREE shipping</span>!
                      </div>
                      <div className="h-2 w-full rounded-full bg-white">
                        <div
                          className="h-2 rounded-full transition-all duration-300 bg-pop-red-accent"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 px-6">
                    <div className="space-y-3 rounded-xl p-3 ring-2 sm:p-4">
                      <div className="text-sm">
                        You&apos;ve qualified for <span className="font-semibold">FREE shipping</span>!
                      </div>
                      <div className="h-2 w-full rounded-full bg-white">
                        <div
                          className="h-2 rounded-full transition-all duration-300 bg-pop-teal-mid"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 flex-col divide-y-2 divide-dashed overflow-y-auto px-6 sm:mt-2">
                  {cart?.items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {/* Footer */}
            {!isLoading && itemCount > 0 && (
              <div className="mt-auto space-y-4 border-t-2 px-6 pt-3 md:pt-6">
                {/* Gift Wrap Checkbox */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGiftWrap(!giftWrap)}
                    className={`peer inline-flex size-5 shrink-0 items-center justify-center rounded border-2 bg-white shadow-3d transition-all duration-150 ease-in-out active:scale-[0.98] ${
                      giftWrap ? "bg-pop-red-accent border-pop-red-accent" : ""
                    }`}
                    role="checkbox"
                    type="button"
                    aria-checked={giftWrap}
                  >
                    {giftWrap && (
                      <div className="text-white">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                  <label className="text-lg font-semibold cursor-pointer">
                    Want it gift wrapped? <span className="text-sm text-gray-600">(+$5)</span>
                  </label>
                </div>

                {/* Note or Personalised message */}
                <div>
                  <button
                    type="button"
                    onClick={() => setNoteExpanded(!noteExpanded)}
                    className="flex w-full items-center justify-between text-left text-lg font-semibold transition-colors hover:text-pop-red-accent"
                    aria-expanded={noteExpanded}
                  >
                    <span>Note or Personalised message</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        noteExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {noteExpanded && (
                    <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <textarea
                        id="order-note"
                        placeholder="Add a note or a personalised message"
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm shadow-3d transition-all focus:ring-0 focus:outline-none"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 p-1">
                        <button
                          onClick={() => {
                            // Save note logic here
                            setNoteExpanded(false);
                          }}
                          className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-8 px-4 py-2 text-sm rounded-full"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between border-t-2 border-dashed pt-4">
                  <p className="font-family-trade-gothic text-lg font-semibold uppercase">Subtotal:</p>
                  <div className="flex items-center gap-4">
                    <p className="font-reika-script text-3xl">
                      ${subtotalFormatted.whole}.{subtotalFormatted.decimal}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </button>
                <p className="text-center text-[11px] md:text-sm">Tax included. Shipping calculated at checkout.</p>
              </div>
            )}

            {/* Empty Cart Footer */}
            {!isLoading && itemCount === 0 && (
              <div className="mt-auto space-y-4 border-t-2 px-6 pt-3 md:pt-6">
                <button
                  onClick={closeCart}
                  className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
