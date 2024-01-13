import { Schema } from "mongoose";

const CoinSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerCoin: {
    type: Number,
    required: true,
  },
});

const WalletSchema = new Schema({
  totalValue: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  coins: {
    type: [CoinSchema],
    default: [],
  },
});

export default WalletSchema;
