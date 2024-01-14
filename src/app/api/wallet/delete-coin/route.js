import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const DELETE = async (req) => {
  const { userId, walletId, coinApiID } = await req.json();

  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!coinApiID) {
      return new Response("Incomplete information", { status: 400 });
    }

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return new Response("Invalid Wallet ID format", { status: 400 });
    }

    const currentWallet = user.wallets.find(
      (wallet) => wallet._id.toString() === walletId
    );

    if (!currentWallet) {
      return new Response("Wallet not found", { status: 404 });
    }

    const existingCoin = currentWallet.coins.find(
      (coin) => coin.coinApiID === coinApiID
    );

    if (!existingCoin) {
      return new Response("Coin not found", { status: 404 });
    }

    const filteredCoins = currentWallet.coins.filter(
      (coin) => coin.coinApiID !== coinApiID
    );

    currentWallet.coins = filteredCoins;

    await user.save();

    return new Response(JSON.stringify(currentWallet), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to add coin", {
      status: 500,
    });
  }
};
