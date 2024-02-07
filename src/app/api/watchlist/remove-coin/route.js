import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const PATCH = async (req) => {
  const { userId, watchlistId, id } = await req.json();

  try {
    await connectToDB();

    if (!userId || !watchlistId || id === undefined || id === null) {
      return new Response("Incomplete information", { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      return new Response("Invalid Watchlist ID format", { status: 400 });
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
