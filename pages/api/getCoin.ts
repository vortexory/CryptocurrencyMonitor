import { CMC_API_KEY, CMC_COIN_INFO_URL } from "@/utils/constants";
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
    return res.status(400).json({ error: symbol });
  }

  try {
    const response = await fetch(
      `${CMC_COIN_INFO_URL}${symbol}&${CMC_API_KEY}${apiKey}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
