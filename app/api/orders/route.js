export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (_id) {
    const order = await Order.findById(_id);
    if (order && (admin || order.userEmail === userEmail)) {
      return Response.json(order);
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (admin) {
    return Response.json(await Order.find());
  }

  if (userEmail) {
    return Response.json(await Order.find({ userEmail }));
  }

  return new Response("Unauthorized", { status: 401 });
}
