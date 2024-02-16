import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, walletId } = await req.json();

  if (!validateFields([userId, walletId])) {
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

    if (!isObjectIdOrHexString(walletId)) {
      return new Response("Invalid wallet format", { status: 400 });
    }

    const currentWalletIndex = user.wallets.findIndex(
      (wallet) => wallet._id.toString() === walletId
    );

    if (currentWalletIndex === -1) {
      return new Response("Wallet not found", { status: 404 });
    }

    user.wallets.splice(currentWalletIndex, 1);

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
