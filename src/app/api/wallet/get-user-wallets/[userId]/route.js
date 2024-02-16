import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";

import User from "@/models/user";

export const GET = async (_, { params }) => {
  const { userId } = params;

  try {
    await connectToDB();

    if (!isObjectIdOrHexString(userId)) {
      return new Response("Invalid userId format", { status: 400 });
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
    return new Response("Server error", {
      status: 500,
    });
  }
};
