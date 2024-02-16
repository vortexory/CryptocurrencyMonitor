import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const POST = async (req) => {
  const { userId, walletName } = await req.json();

  if (!validateFields([userId, walletName])) {
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

    const newWallet = {
      name: walletName,
      coins: [],
      totalValue: 0,
    };

    user.wallets.push(newWallet);

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
