import { isAdmin } from "../auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

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
    handleError(error);
  }
}

function handleError(error) {
  console.error("Error:", error);
  return Response.json(
    { message: error.message || "An error occurred" },
    { status: 500 }
  );
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name } = await req.json();
    if (await isAdmin()) {
      const categoryDoc = await Category.create({ name });
      return Response.json({
        message: "Category created successfully",
        category: categoryDoc,
      });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { _id, name } = await req.json();
    if (await isAdmin()) {
      await Category.updateOne({ _id }, { name });
      return Response.json({ message: "Category updated successfully" });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    if (categories.length === 0) {
      return Response.json({ message: "No categories found" });
    }
    return Response.json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    if (await isAdmin()) {
      await Category.deleteOne({ _id });
      return Response.json({ message: "Category deleted successfully" });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);
  }
}
