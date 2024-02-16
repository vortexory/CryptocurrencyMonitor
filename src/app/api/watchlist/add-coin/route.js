import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const POST = async (req) => {
  const { userId, watchlistId, coins } = await req.json();

  if (!validateFields([userId, watchlistId, coins])) {
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
      (list) => list._id.toString() === watchlistId
    );

    if (!currentWatchlist) {
      return new Response("Watchlist not found", { status: 404 });
    }

    let invalidFormat = false;
    let duplicateCoin = false;

    for (const coin of coins) {
      if (
        !coin.id ||
        !coin.name ||
        coin.cmcRank === undefined ||
        coin.cmcRank === null
      ) {
        invalidFormat = true;
        break;
      }

      const existingCoin = currentWatchlist.coins.find((c) => c.id === coin.id);

      if (existingCoin) {
        duplicateCoin = true;
        break;
      }

      currentWatchlist.coins.push({
        id: coin.id,
        name: coin.name,
        cmcRank: coin.cmcRank,
      });
    }

    if (invalidFormat) {
      return new Response("Invalid coin format", {
        status: 400,
      });
    }

    if (duplicateCoin) {
      return new Response("Duplicate coin in the watchlist", {
        status: 409,
      });
    }

    await user.save();

    return new Response(JSON.stringify(currentWatchlist), {
      status: 201,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
