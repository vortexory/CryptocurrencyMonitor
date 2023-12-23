import { CMC_API_KEY, CMC_QUOTE_URL, CMC_MAP_URL } from "@/utils/constants";
import { CoinData, QuoteResponse } from "@/utils/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.CMC_API_KEY;
  const { symbol } = req.query;

  if (!apiKey) {
    return res.status(401).json({ error: "API Key not found" });
  }

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "Symbol not found" });
  }

  try {
    const mapResponse = await fetch(
      `${CMC_MAP_URL}${symbol}&${CMC_API_KEY}${apiKey}`
    );

    const mapData = await mapResponse.json();

    if (mapData.status.error_code !== 0) {
      return res
        .status(mapData.status.error_code)
        .json({ error: "Error fetching data" });
    }

    let coinsList: CoinData[] = [];

    const coinsIds = mapData.data.map((coin: any) => coin.id);
    const quotePromises = coinsIds.map((coinId: number) =>
      fetch(`${CMC_QUOTE_URL}${coinId}&${CMC_API_KEY}${apiKey}`).then(
        (response) => response.json()
      )
    );

    const coinsQuotes: QuoteResponse[] = await Promise.all(quotePromises);

    coinsQuotes.forEach((quoteData) => {
      coinsList.push(quoteData.data);
    });

    res.status(200).json(coinsList);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
