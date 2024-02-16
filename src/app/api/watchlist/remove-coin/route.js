import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, watchlistId, id } = await req.json();

  if (!validateFields([userId, watchlistId, id])) {
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

    if (!isObjectIdOrHexString(watchlistId)) {
      return new Response("Invalid watchlistId format", { status: 400 });
    }

    const currentWatchlist = user.watchlists.find(
      (watchlist) => watchlist._id.toString() === watchlistId
    );

    if (!currentWatchlist) {
      return new Response("Watchlist not found", { status: 404 });
    }

    const existingCoin = currentWatchlist.coins.find((coin) => coin.id === id);

    if (!existingCoin) {
      return new Response("Coin not found", { status: 404 });
    }

    const filteredCoins = currentWatchlist.coins.filter(
      (coin) => coin.id !== id
    );

    currentWatchlist.coins = filteredCoins;

    await user.save();

    return new Response(JSON.stringify(currentWatchlist), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to delete coin", {
      status: 500,
    });
  }
};
