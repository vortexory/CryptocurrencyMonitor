import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, watchlistId } = await req.json();

  if (!validateFields([userId, watchlistId])) {
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

    const currentWatchlistIndex = user.watchlists.findIndex(
      (list) => list._id.toString() === watchlistId
    );

    if (currentWatchlistIndex === -1) {
      return new Response("Watchlist not found", { status: 404 });
    }

    const currentWatchlist = user.watchlists.find(
      (list) => list._id.toString() === watchlistId
    );

    if (currentWatchlist.main) {
      return new Response("Main watchlist cannot be deleted", { status: 400 });
    }

    user.watchlists.splice(currentWatchlistIndex, 1);

    await user.save();

    return new Response(
      JSON.stringify({ updatedWatchlists: user.watchlists }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Server error", {
      status: 500,
    });
  }
};
