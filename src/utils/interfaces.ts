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

interface CryptoData {
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
