import { CMC_API_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.CMC_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "API Key not found" });
  }

  try {
    const response = await fetch(`${CMC_API_URL}${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
