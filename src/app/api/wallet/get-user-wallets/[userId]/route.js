import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const GET = async (_, { params }) => {
  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(params.userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(params.userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const userWallets = user.wallets;

    return new Response(JSON.stringify(userWallets), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to send user wallets", {
      status: 500,
    });
  }
};
