import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "../../../models/User";
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

// Centralized database connection
async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

// Update user information (PUT)
export async function PUT(req) {
    await connectToDatabase();
    try {
        const data = await req.json();
        const { _id, name, image, ...otherUserInfo } = data;

        // Validate required fields
        if (!name || !image) {
            return Response.json(
                { error: "Name and image are required fields." },
                { status: 400 }
            );
        }

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

        // Update User and UserInfo
        const user = await User.findOne(filter);
        if (!user) {
            return Response.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        await User.updateOne(filter, { name, image });
        await UserInfo.findOneAndUpdate(
            { email: user.email },
            otherUserInfo,
            { upsert: true, new: true }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error updating user information:", error);
        return Response.json(
            { error: "Failed to update user information." },
            { status: 500 }
        );
    }
}

// Fetch user information (GET)
export async function GET(req) {
    await connectToDatabase();
    try {
        const url = new URL(req.url);
        const _id = url.searchParams.get("_id");

        let filterUser = {};
        if (_id) {
            filterUser = { _id };
        } else {
            const session = await getServerSession(authOptions);
            const email = session?.user?.email;
            if (!email) {
                return Response.json({}, { status: 401 });
            }
            filterUser = { email };
        }

        const user = await User.findOne(filterUser).lean();
        if (!user) {
            return Response.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const userInfo = await UserInfo.findOne({ email: user.email }).lean();
        return Response.json({ ...user, ...userInfo });
    } catch (error) {
        console.error("Error fetching user information:", error);
        return Response.json(
            { error: "Failed to fetch user information." },
            { status: 500 }
        );
    }
}
