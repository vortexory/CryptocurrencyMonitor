import { CMC_API_KEY, CMC_LIST_URL } from "@/utils/constants";

export const fetchCache = 'force-no-store';

export const GET = async () => {
  try {
    const apiKey = process.env.CMC_API_KEY;

    if (!apiKey) {
      return new Response("API Key not found", { status: 401 });
    }

    const response = await fetch(`${CMC_LIST_URL}${CMC_API_KEY}${apiKey}`);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
};
