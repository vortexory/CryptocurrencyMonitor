import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const PATCH = async (req) => {
  const { userId, watchlistId, newName, newDescription, main } =
    await req.json();

  try {
    await connectToDB();

    if (!userId || !watchlistId) {
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
    console.log(error);

    return new Response("Server error", {
      status: 500,
    });
  }
};
