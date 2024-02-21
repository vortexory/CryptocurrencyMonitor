import { Schema } from "mongoose";

const WatchlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coins: {
    type: [
      {
        id: Number,
        name: String,
        cmcRank: Number,
        circulatingSupply: Number,
        marketCap: Number,
        oneDayChange: Number,
        oneDayVolume: Number,
        oneHourChange: Number,
        price: Number,
        sevenDaysChange: Number,
      },
    ],
    default: [],
  },
  main: {
    type: Boolean,
    required: true,
  },
});

export default WatchlistSchema;
