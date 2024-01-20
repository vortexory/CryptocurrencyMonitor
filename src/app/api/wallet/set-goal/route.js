import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const PATCH = async (req) => {
  const { userId, newGoal } = await req.json();

  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (newGoal === undefined || newGoal === null) {
      return new Response("Incomplete information", { status: 400 });
    }

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    user.walletsValueGoal = newGoal;

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response("Failed to add or edit goal", {
      status: 500,
    });
  }
};
