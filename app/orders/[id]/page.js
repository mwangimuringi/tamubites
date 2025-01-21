import { useContext, useEffect } from "react";
import { CartContext } from "@/components/AppContext";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes("clear-cart=1")) {
        clearCart();
      }
    }
  }, []);

  return <section>Order Page with cart clearing logic.</section>;
}
