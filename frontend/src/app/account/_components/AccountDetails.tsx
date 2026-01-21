"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  type LoginResponse,
  updateProfile,
  validateAustralianPhone,
  getPostalAddresses,
  createPostalAddress,
  updatePostalAddress,
} from "@/lib/api/auth";

type AccountDetailsProps = {
  user: LoginResponse["user"];
};

export default function AccountDetails({ user }: AccountDetailsProps) {
  const [personalDetails, setPersonalDetails] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    phone: user.phone || "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [hasInteractedPhone, setHasInteractedPhone] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [addressDetails, setAddressDetails] = useState({
    id: null as number | null,
    address_first_name: "",
    address_last_name: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "Australia",
    zip: "",
    address_phone: "",
  });

  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // Load user's postal address on mount
  useEffect(() => {
    const loadPostalAddress = async () => {
      try {
        setIsLoadingAddress(true);
        const addresses = await getPostalAddresses();
        if (addresses.length > 0) {
          const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
          setAddressDetails({
            id: defaultAddress.id || null,
            address_first_name: defaultAddress.first_name || "",
            address_last_name: defaultAddress.last_name || "",
            company: defaultAddress.company || "",
            address1: defaultAddress.address_line_1 || "",
            address2: defaultAddress.address_line_2 || "",
            city: defaultAddress.city || "",
            province: defaultAddress.province || "",
            country: defaultAddress.country || "Australia",
            zip: defaultAddress.postal_code || "",
            address_phone: defaultAddress.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to load postal address:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    loadPostalAddress();
  }, []);

  // Update phone when user changes
  useEffect(() => {
    setPersonalDetails({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
    });
  }, [user]);

  const handlePhoneChange = (value: string) => {
    setPersonalDetails({ ...personalDetails, phone: value });
    setHasInteractedPhone(true);
    if (value && !validateAustralianPhone(value)) {
      setPhoneError("Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)");
    } else {
      setPhoneError("");
    }
  };

  const handlePersonalDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone if provided
    if (personalDetails.phone && !validateAustralianPhone(personalDetails.phone)) {
      setPhoneError("Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)");
      toast.error("Please enter a valid Australian phone number");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        first_name: personalDetails.first_name,
        last_name: personalDetails.last_name,
        phone: personalDetails.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const apiError = error as { phone?: string[]; error?: string };
      const errorMessage = apiError?.phone?.[0] || apiError?.error || "Failed to update profile";
      toast.error(errorMessage);
      if (apiError?.phone) {
        setPhoneError(apiError.phone[0]);
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUpdatingAddress(true);
    try {
      const addressData = {
        first_name: addressDetails.address_first_name,
        last_name: addressDetails.address_last_name,
        company: addressDetails.company || undefined,
        address_line_1: addressDetails.address1,
        address_line_2: addressDetails.address2 || undefined,
        city: addressDetails.city,
        province: addressDetails.province,
        country: addressDetails.country,
        postal_code: addressDetails.zip,
        phone: addressDetails.address_phone || undefined,
        is_default: true,
      };

      if (addressDetails.id) {
        await updatePostalAddress(addressDetails.id, addressData);
        toast.success("Address updated successfully!");
      } else {
        const newAddress = await createPostalAddress(addressData);
        setAddressDetails({ ...addressDetails, id: newAddress.id || null });
        toast.success("Address saved successfully!");
      }
    } catch (error: unknown) {
      const apiError = error as { error?: string };
      const errorMessage = apiError?.error || "Failed to save address";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  return (
    <section className="max-w-2xl">
      <div>
        <h3 className="font-reika-script text-4xl md:text-6xl">Account Details</h3>

        {/* Personal Details */}
        <div className="mt-8">
          <h4 className="mb-6 font-price-check text-2xl font-stretch-expanded">
            Personal Details
          </h4>
          <form className="space-y-6" onSubmit={handlePersonalDetailsSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="first_name" className="text-lg font-semibold">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={personalDetails.first_name}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, first_name: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="last_name" className="text-lg font-semibold">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={personalDetails.last_name}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, last_name: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="phone" className="text-lg font-semibold">
                  Mobile Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+61412345678 or 0412345678"
                  value={personalDetails.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => setHasInteractedPhone(true)}
                  className={`w-full rounded-full border-2 bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none ${
                    phoneError || (hasInteractedPhone && personalDetails.phone && !validateAustralianPhone(personalDetails.phone))
                      ? "border-red-500"
                      : "border-pop-neutral-black"
                  }`}
                />
                {phoneError && (
                  <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                )}
                {hasInteractedPhone && personalDetails.phone && !validateAustralianPhone(personalDetails.phone) && !phoneError && (
                  <p className="text-sm text-red-600 mt-1">
                    Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-start pt-6">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="font-ultra-bold flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-8 py-2 text-lg md:text-xl rounded-full"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
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
              </button>
            </div>
          </form>
        </div>

        {/* Postal Address */}
        <div className="mt-12">
          <h4 className="mb-6 font-price-check text-2xl font-stretch-expanded">
            Postal Address
          </h4>
          <form className="space-y-6" onSubmit={handleAddressSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="address_first_name" className="text-lg font-semibold">
                  First Name
                </label>
                <input
                  id="address_first_name"
                  name="address_first_name"
                  type="text"
                  required
                  value={addressDetails.address_first_name}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address_first_name: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="address_last_name" className="text-lg font-semibold">
                  Last Name
                </label>
                <input
                  id="address_last_name"
                  name="address_last_name"
                  type="text"
                  required
                  value={addressDetails.address_last_name}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address_last_name: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="company" className="text-lg font-semibold">
                  Company (Optional)
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={addressDetails.company}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, company: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="address1" className="text-lg font-semibold">
                  Address Line 1
                </label>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  required
                  value={addressDetails.address1}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address1: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="address2" className="text-lg font-semibold">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  value={addressDetails.address2}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address2: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-lg font-semibold">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={addressDetails.city}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, city: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="province" className="text-lg font-semibold">
                  State/Province
                </label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  required
                  value={addressDetails.province}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, province: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-lg font-semibold">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={addressDetails.country}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, country: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="zip" className="text-lg font-semibold">
                  Postal/ZIP Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  value={addressDetails.zip}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, zip: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="address_phone" className="text-lg font-semibold">
                  Phone (Optional)
                </label>
                <input
                  id="address_phone"
                  name="address_phone"
                  type="tel"
                  value={addressDetails.address_phone}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address_phone: e.target.value })
                  }
                  className="w-full rounded-full border-2 border-pop-neutral-black bg-white py-2 px-4 shadow-3d focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-start pt-6">
              <button
                type="submit"
                disabled={isUpdatingAddress || isLoadingAddress}
                className="font-ultra-bold flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
              >
                {isUpdatingAddress ? "Updating..." : isLoadingAddress ? "Loading..." : "Update Address"}
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
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
