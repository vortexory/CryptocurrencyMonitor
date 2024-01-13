import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const POST = async (req) => {
  const { userId, walletId, coinName, coinApiID, quantity, pricePerCoin } =
    await req.json();

  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!coinName || !coinApiID || !quantity || !pricePerCoin) {
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

    const newTransaction = {
      quantity,
      pricePerCoin,
    };

    if (!existingCoin) {
      const newCoin = {
        name: coinName,
        coinApiID,
        transactions: [newTransaction],
      };

      currentWallet.coins.push(newCoin);

      const currentWalletIndex = user.wallets.findIndex(
        (wallet) => wallet._id === walletId
      );

      user.wallets[currentWalletIndex] = currentWallet;
    } else {
      existingCoin.transactions.push(newTransaction);
    }

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return new Response("Failed to add coin", {
      status: 500,
    });
  }
};
