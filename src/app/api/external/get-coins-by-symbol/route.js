import { CMC_API_KEY, CMC_QUOTE_URL, CMC_MAP_URL } from "@/utils/constants";

export const GET = async (req) => {
  try {
    const apiKey = process.env.CMC_API_KEY;
    const symbol = req.nextUrl.searchParams.get("symbol");

    if (!apiKey) {
      return new Response("API Key not found", { status: 401 });
    }

    if (!symbol || typeof symbol !== "string") {
      return new Response("Symbol not found", { status: 400 });
    }

    const mapResponse = await fetch(
      `${CMC_MAP_URL}${symbol}&${CMC_API_KEY}${apiKey}`
    );

    const mapData = await mapResponse.json();

    if (mapData.status.error_code !== 0) {
      return res
        .status(mapData.status.error_code)
        .json({ error: "Error fetching data" });
    }

    let coinsList = [];

    const coinsIds = mapData.data.map((coin) => coin.id);
    const quotePromises = coinsIds.map((coinId) =>
      fetch(`${CMC_QUOTE_URL}${coinId}&${CMC_API_KEY}${apiKey}`).then(
        (response) => response.json()
      )
    );

    const coinsQuotes = await Promise.all(quotePromises);

    coinsQuotes.forEach((quoteData) => {
      coinsList.push(quoteData.data);
    });

    return new Response(JSON.stringify(coinsList), {
      status: 200,
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
