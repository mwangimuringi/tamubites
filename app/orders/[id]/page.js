import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (id) {
      setLoadingOrder(true);
      fetch("/api/orders?_id=" + id).then((res) => {
        res.json().then((orderData) => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      });
    }
  }, []);

  return (
    <section>
      {loadingOrder && <div>Loading order...</div>}
      {order && <div>Order fetched: {JSON.stringify(order)}</div>}
    </section>
  );
}
