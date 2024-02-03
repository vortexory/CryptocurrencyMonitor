interface Quote {
  fully_diluted_market_cap: number | null;
  last_updated: string | null;
  market_cap: number | null;
  market_cap_dominance: number | null;
  percent_change_1h: number | null;
  percent_change_7d: number | null;
  percent_change_24h: number | null;
  percent_change_30d: number | null;
  percent_change_60d: number | null;
  percent_change_90d: number | null;
  price: number | null;
  tvl: null | null;
  volume_24h: number | null;
  volume_change_24h: number | null;
}

export interface CoinData {
  circulating_supply: number | null;
  cmc_rank: number | null;
  date_added: string | null;
  id: number | null;
  infinite_supply: boolean | null;
  last_updated: string | null;
  max_supply: number | null;
  name: string | null;
  num_market_pairs: number | null;
  platform: null | string;
  quote: {
    USD: Quote;
  };
  self_reported_circulating_supply: boolean | null;
  self_reported_market_cap: boolean | null;
  slug: string | null;
  symbol: string | null;
  tags: string[];
  total_supply: number | null;
  tvl_ratio: number | null;
}

export interface QuoteResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: CoinData;
}

export interface SelectedCoinInfo {
  quantity: number;
  pricePerCoin: number;
}

export interface Watchlist {
  name: string;
  description: string;
  _id: string;
  coins: Array<{ name: string; id: number }>;
  main: boolean;
}

export interface Session {
  expires: string | null;
  user: {
    email: string | null;
    id: string | null;
    image: string | null;
    name: string | null;
    walletsValueGoal: number;
    watchlists: Array<Watchlist>;
  } | null;
}

export type TransactionType = "buy" | "sell";

export interface Transaction {
  _id: string;
  quantity: number;
  pricePerCoin: number;
  newWalletValue: number;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsView {
  open: boolean;
  coin: {
    quantity: number;
    transactions: Transaction[];
    name: string;
    avgBuyPrice: number;
    coinApiID: number;
  } | null;
}

export interface Coin {
  coinApiID: number;
  name: string;
  transactions: Transaction[];
  _id: string;
  totalQuantity: number;
}

export interface UserWallet {
  name: string;
  _id: string;
  coins: any[];
  totalValue: number;
}
