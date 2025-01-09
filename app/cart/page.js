"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import CartProduct from "@/components/menu/CartProduct";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.href.includes("canceled=1")
    ) {
      toast.error("Payment failed 😔");
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
  }, [profileData]);

  const subtotal = useMemo(
    () =>
      cartProducts.reduce((sum, product) => sum + cartProductPrice(product), 0),
    [cartProducts]
  );

  const total = useMemo(() => subtotal + 5, [subtotal]);

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function proceedToCheckout(event) {
    event.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, cartProducts }),
      });

      if (response.ok) {
        const redirectUrl = await response.json();
        toast.success("Redirecting to payment...");
        window.location = redirectUrl;
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Something went wrong... Please try again later"
        );
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!cartProducts?.length) {
    return (
      <main className="mt-8 text-center">
        <header>
          <SectionHeaders mainHeader="Cart" />
        </header>
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </main>
    );
  }

  return (
    <main className="mt-8">
      <header className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </header>
      <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
        <section>
          {cartProducts.map((product, index) => (
            <CartProduct
              key={index}
              product={product}
              onRemove={removeCartProduct}
            />
          ))}
          <div className="py-2 pr-4 lg:pr-16 flex justify-between items-center">
            <div className="text-gray-500 text-sm lg:text-base">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold text-right text-sm lg:text-base">
              ${subtotal}
              <br />
              $5
              <br />${total}
            </div>
          </div>
        </section>
        <section className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <form onSubmit={proceedToCheckout} aria-busy={loading}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button
              type="submit"
              aria-label={`Pay ${total} dollars`}
              className={`mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay $${total}`}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
