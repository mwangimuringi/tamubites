import AddressInputs from "@/components/layout/AddressInputs";

export default function OrderPage() {
  const [order, setOrder] = useState();

  return (
    <section>
      {order && (
        <div>
          <AddressInputs disabled={true} addressProps={order} />
        </div>
      )}
    </section>
  );
}
