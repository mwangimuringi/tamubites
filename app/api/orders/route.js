import mongoose from "mongoose";
import { Order } from "@/models/Order";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (_id) {
    return Response.json(await Order.findById(_id));
  }

  return Response.json(await Order.find());
}
