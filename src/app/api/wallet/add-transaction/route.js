import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const POST = async (req) => {
  const { userId, walletId, coinApiID, quantity, pricePerCoin, type } =
    await req.json();

  if (
    !validateFields([userId, walletId, coinApiID, quantity, pricePerCoin, type])
  ) {
    return new Response("Incomplete information", { status: 400 });
  }

  if (type !== "buy" && type !== "sell") {
    return new Response("Invalid type", { status: 400 });
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
      return new Response("Invalid walletId format", { status: 400 });
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

    if (existingCoin.totalQuantity < quantity && type === "sell") {
      return new Response("Insufficient quantity available for sale", {
        status: 400,
      });
    }

    const newTransactionValue = +(quantity * pricePerCoin).toFixed(2);
    const newWalletValue =
      type === "buy"
        ? +currentWallet.totalValue + newTransactionValue
        : +currentWallet.totalValue - newTransactionValue;

    const newTransaction = {
      quantity,
      pricePerCoin,
      newWalletValue,
      type,
    };

    existingCoin.transactions.push(newTransaction);

    existingCoin.totalQuantity =
      type === "buy"
        ? existingCoin.totalQuantity + quantity
        : existingCoin.totalQuantity - quantity;

    currentWallet.totalValue = newWalletValue;

    await user.save();

    return new Response(JSON.stringify(currentWallet), {
      status: 201,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
