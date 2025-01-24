import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from '../../../models/User';
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const { _id, name, image, ...otherUserInfo } = data;

  let filter = {};
if (_id) {
    filter = { _id };
} else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return Response.json(
            { error: "Unauthorized: Session not found." },
            { status: 401 }
        );
    }
    filter = { email };
}

  const user = await User.findOne(filter);
  await User.updateOne(filter, { name, image });
  await UserInfo.findOneAndUpdate({ email: user.email }, otherUserInfo, {
    upsert: true,
  });

  if (!name || !image) {
    return Response.json(
        { error: "Name and image are required fields." },
        { status: 400 }
    );
}

  return Response.json(true);
}

    //Fetch users info
export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return Response.json({});
    }
    filterUser = { email };
  }

  const user = await User.findOne(filterUser).lean();
  const userInfo = await UserInfo.findOne({ email: user.email }).lean();

  return Response.json({ ...user, ...userInfo });
}

// Centralized database connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
  }
}
