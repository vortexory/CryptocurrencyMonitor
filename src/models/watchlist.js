import { Schema } from "mongoose";

const WatchlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coins: {
    type: [{ id: Number, name: String }],
    default: [],
  },
  main: {
    type: Boolean,
    required: true,
  },
});

export default WatchlistSchema;
