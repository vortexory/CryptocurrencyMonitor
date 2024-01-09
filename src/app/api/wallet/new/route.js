import { connectToDB } from "@/utils/database";
import Wallet from "@/models/wallet";

export const POST = async (req, res) => {
  const { userId } = await req.json();

  try {
    await connectToDB();

    const newWallet = new Wallet({ creator: userId });

    await newWallet.save();

    return new Response(JSON.stringify(newWallet), {
      status: 201,
    });
  } catch (error) {
    return new Response("Failed to create a new wallet", {
      status: 500,
    });
  }
};
