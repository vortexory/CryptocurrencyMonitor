import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const PATCH = async (req) => {
  const { userId, watchlistId, newName, newDescription, main } =
    await req.json();

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

    if (!isObjectIdOrHexString(watchlistId)) {
      return new Response("Invalid walletId format", { status: 400 });
    }

    const currentWatchlist = user.watchlists.find(
      (list) => list._id.toString() === watchlistId
    );

    if (!currentWatchlist) {
      return new Response("Watchlist not found", { status: 404 });
    }

    if (newName?.trim()) {
      currentWatchlist.name = newName;
    }

    if (newDescription?.trim()) {
      currentWatchlist.description = newDescription;
    }

    if (main && !currentWatchlist.main) {
      const currentMainWatchlist = user.watchlists.find(
        (watchlist) => watchlist.main
      );

      if (currentMainWatchlist) {
        currentMainWatchlist.main = false;
      }

      currentWatchlist.main = true;
    }

    await user.save();

    return new Response(
      JSON.stringify({
        updatedWatchlist: currentWatchlist,
        updatedWatchlists: user.watchlists,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
