import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const POST = async (req) => {
  const { userId, walletId, coinName, coinApiID, quantity, pricePerCoin } =
    await req.json();

  if (
    !validateFields([
      userId,
      walletId,
      coinName,
      coinApiID,
      quantity,
      pricePerCoin,
    ])
  ) {
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

    const newTransactionValue = +(quantity * pricePerCoin).toFixed(2);
    const newWalletValue = +currentWallet.totalValue + newTransactionValue;

    const newTransaction = {
      quantity,
      pricePerCoin,
      newWalletValue,
      type: "buy",
    };

    if (!existingCoin) {
      const newCoin = {
        name: coinName,
        coinApiID,
        transactions: [newTransaction],
        totalQuantity: quantity,
      };

      currentWallet.coins.push(newCoin);
    } else {
      existingCoin.transactions.push(newTransaction);
      existingCoin.totalQuantity = existingCoin.totalQuantity + quantity;
    }

    currentWallet.totalValue = newWalletValue;

    await user.save();

    return new Response(JSON.stringify(currentWallet), {
      status: 201,
    });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
};
