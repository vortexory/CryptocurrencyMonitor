import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const POST = async (req) => {
  const { userId, watchlistId, coinApiID, coinName } = await req.json();

  try {
    await connectToDB();

    if (!userId || !coinApiID || !coinName) {
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
      (list) => list._id.toString() === watchlistId
    );

    if (!currentWatchlist) {
      return new Response("Watchlist not found", { status: 404 });
    }

    const existingCoin = currentWatchlist.coins.find(
      (coin) => coin.id === coinApiID
    );

    if (existingCoin) {
      return new Response("The watchlist already contains this coin", {
        status: 409,
      });
    }

    currentWatchlist.coins.push({ id: coinApiID, name: coinName });

    await user.save();

    return new Response(JSON.stringify(currentWatchlist), {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return new Response("Server error", {
      status: 500,
    });
  }
};
