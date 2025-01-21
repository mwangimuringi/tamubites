import CartProduct from "@/components/menu/CartProduct";

export default function OrderPage() {
  const [order, setOrder] = useState();
  const subtotal = 100; // Example subtotal calculation

  return (
    <section>
      {order && (
        <div>
          {order.cartProducts.map((product) => (
            <CartProduct key={product._id} product={product} />
          ))}
          <div>
            Subtotal: ${subtotal}
            <br />
            Delivery: $5
            <br />
            Total: ${subtotal + 5}
          </div>
        </div>
      )}
    </section>
  );
}
