"use client";

import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import CartProduct from "@/components/menu/CartProduct";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

  // Notify user if payment fails
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.href.includes("canceled=1")
    ) {
      toast.error("Payment failed 😔");
    }
  }, []);

  // Pre-fill address from profile data
  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
  }, [profileData]);

  // Calculate subtotal
  const calculateSubtotal = () =>
    cartProducts.reduce((sum, product) => sum + cartProductPrice(product), 0);

  // Calculate total (subtotal + delivery fee)
  const calculateTotal = (subtotal) => subtotal + 5;

  // Handle address changes
  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  // Proceed to checkout
  async function proceedToCheckout(event) {
    event.preventDefault();

    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, cartProducts }),
      })
        .then(async (response) => {
          if (response.ok) {
            resolve();
            window.location = await response.json();
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });

    await toast.promise(promise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal(subtotal);

  if (!cartProducts?.length) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts.map((product, index) => (
            <CartProduct
              key={index}
              product={product}
              onRemove={removeCartProduct}
            />
          ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal}
              <br />
              $5
              <br />${total}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button
              type="submit"
              className="mt-4 w-full bg-primary text-white py-2 rounded"
            >
              Pay ${total}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
