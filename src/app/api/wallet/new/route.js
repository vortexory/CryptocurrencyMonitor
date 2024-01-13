import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const POST = async (req) => {
  const { userId, walletName } = await req.json();

  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!walletName) {
      return new Response("Wallet name must be provided", { status: 400 });
    }

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const newWallet = {
      name: walletName,
      coins: [],
      totalValue: 0,
    };

    user.wallets.push(newWallet);

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (error) {
    return new Response("Failed to create a new wallet", {
      status: 500,
    });
  }
};
