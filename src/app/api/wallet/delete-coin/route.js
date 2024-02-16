import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, walletId, coinApiID } = await req.json();

  if (!validateFields([userId, walletId, coinApiID])) {
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
      return new Response("Invalid walletID format", { status: 400 });
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

    const totalDeletedCoinValue = +existingCoin.transactions
      .map(
        (transaction) =>
          +(transaction.quantity * transaction.pricePerCoin).toFixed(2)
      )
      .reduce((acc, currentVal) => acc + currentVal, 0);

    currentWallet.totalValue =
      +currentWallet.totalValue - totalDeletedCoinValue;

    await user.save();

    return new Response(JSON.stringify(currentWallet), {
      status: 200,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
