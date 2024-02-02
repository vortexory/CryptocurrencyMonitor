import { Schema, model, models } from "mongoose";
import WalletSchema from "@/models/wallet";
import WatchlistSchema from "@/models/watchlist";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists."],
    required: [true, "Email is required."],
  },
  username: {
    type: String,
    required: [true, "Username is required."],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  image: {
    type: String,
  },
  wallets: {
    type: [WalletSchema],
    default: [],
  },
  walletsValueGoal: {
    type: Number,
    default: 0,
  },
  watchlists: {
    type: [WatchlistSchema],
    default: [{ name: "My First Watchlist", coins: [], main: true }],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
