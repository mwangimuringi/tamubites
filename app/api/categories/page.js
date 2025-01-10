import { isAdmin } from '../auth/[...nextauth]/route';
import { Category } from "@/models/Category";
import mongoose from "mongoose";

// Singleton pattern to handle database connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
}

export async function POST(req) {
  await connectToDatabase();  // Using the singleton connection
  const { name } = await req.json();
  if (await isAdmin()) {
    const categoryDoc = await Category.create({ name });
    return Response.json(categoryDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  await connectToDatabase();  // Using the singleton connection
  const { _id, name } = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({ _id }, { name });
  }
  return Response.json(true);
}

export async function GET() {
  await connectToDatabase();  // Using the singleton connection
  return Response.json(await Category.find());
}

export async function DELETE(req) {
  await connectToDatabase();  // Using the singleton connection
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({ _id });
  }
  return Response.json(true);
}
