import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const PATCH = async (req) => {
  const { userId, walletId } = await req.json();

  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return new Response("Invalid Wallet ID format", { status: 400 });
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
    return new Response("Failed to delete wallet", {
      status: 500,
    });
  }
};
