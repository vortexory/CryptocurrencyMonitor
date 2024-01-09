import mongoose, { Schema, model, models } from "mongoose";

const CoinSchema = new Schema({
  name: String,
  quantity: Number,
  pricePerCoin: Number,
});

const WalletSchema = new Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  coins: {
    type: [CoinSchema],
    default: [],
  },
});

const Wallet = models.Wallet || model("Wallet", WalletSchema);

export default Wallet;
