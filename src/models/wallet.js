import { Schema } from "mongoose";

const Transaction = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  pricePerCoin: {
    type: Number,
    required: true,
  },
});

const CoinSchema = new Schema({
  coinApiID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  transactions: {
    type: [Transaction],
    default: [],
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
