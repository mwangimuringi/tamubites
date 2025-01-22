export default function OrderPage() {
  const [order, setOrder] = useState();
  const subtotal = 100; // Example subtotal calculation

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <h2>Your Order</h2>
      </div>
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map((product) => (
              <div key={product._id}>{product.name}</div>
            ))}
            <div className="text-right">
              Subtotal: ${subtotal}
              <br />
              Delivery: $5
              <br />
              Total: ${subtotal + 5}
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs disabled={true} addressProps={order} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
