import { isObjectIdOrHexString } from "mongoose";

import { connectToDB } from "@/utils/database";
import { validateFields } from "@/utils/serverFunctions";

import User from "@/models/user";

export const POST = async (req) => {
  const { userId, watchlistName, description } = await req.json();

  if (!validateFields([userId, watchlistName])) {
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
    return new Response("Server error", {
      status: 500,
    });
  }
};
