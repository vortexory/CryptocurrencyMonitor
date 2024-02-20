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

    user.wallets.push({
      name: walletName,
      coins: [],
      totalValue: 0,
    });

    await user.save();

    const newWallet = user.wallets[user.wallets.length - 1];

    return new Response(JSON.stringify(newWallet), {
      status: 201,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
