export async function GET(req) {
  try {
    mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const admin = await isAdmin();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (_id) {
      const order = await Order.findById(_id);
      if (order && (admin || order.userEmail === userEmail)) {
        return Response.json({ success: true, order });
      }
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    if (admin) {
      const orders = await Order.find();
      return Response.json({ success: true, orders });
    }

    if (userEmail) {
      const userOrders = await Order.find({ userEmail });
      return Response.json({ success: true, orders: userOrders });
    }

    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
