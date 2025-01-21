import { cartProductPrice } from "@/components/AppContext";

export default function OrderPage() {
  const [order, setOrder] = useState();

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section>
      <div>Subtotal: ${subtotal}</div>
    </section>
  );
}
