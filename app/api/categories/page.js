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
    handleError(error);  // Using the handleError function
  }
}

// Error handling utility function
function handleError(error) {
  console.error("Error:", error);
  return Response.json({ message: error.message || "An error occurred" }, { status: 500 });
}

export async function POST(req) {
  try {
    await connectToDatabase();  // Using the singleton connection
    const { name } = await req.json();
    if (await isAdmin()) {
      const categoryDoc = await Category.create({ name });
      return Response.json({
        message: "Category created successfully",
        category: categoryDoc
      });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);  // Handling errors consistently
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();  // Using the singleton connection
    const { _id, name } = await req.json();
    if (await isAdmin()) {
      await Category.updateOne({ _id }, { name });
      return Response.json({ message: "Category updated successfully" });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);  // Handling errors consistently
  }
}

export async function GET() {
  try {
    await connectToDatabase();  // Using the singleton connection
    const categories = await Category.find();
    return Response.json({
      message: "Categories fetched successfully",
      categories
    });
  } catch (error) {
    return handleError(error);  // Handling errors consistently
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();  // Using the singleton connection
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    if (await isAdmin()) {
      await Category.deleteOne({ _id });
      return Response.json({ message: "Category deleted successfully" });
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    return handleError(error);  // Handling errors consistently
  }
}
