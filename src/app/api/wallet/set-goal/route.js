import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, newGoal } = await req.json();

  if (!validateFields([userId, newGoal])) {
    return new Response("Incomplete information", { status: 400 });
  }

  try {
    await connectToDB();

    if (!isObjectIdOrHexString(userId)) {
      return new Response("Invalid userId format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    user.walletsValueGoal = newGoal;

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
