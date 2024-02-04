import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import mongoose from "mongoose";

export const POST = async (req) => {
  const { userId, watchlistName, description } = await req.json();

  try {
    await connectToDB();

    if (!userId || !watchlistName) {
      return new Response("Incomplete information", { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    user.watchlists.push({
      name: watchlistName,
      description: description ?? "",
      coins: [],
      main: false,
    });

    await user.save();

    const newWatchlist = user.watchlists[user.watchlists.length - 1];

    return new Response(
      JSON.stringify({ updatedWatchlists: user.watchlists, newWatchlist }),
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
