import { CMC_API_KEY, CMC_QUOTE_URL } from "@/utils/constants";

export const GET = async (_, { params }) => {
  const apiKey = process.env.CMC_API_KEY;

  try {
    const response = await fetch(
      `${CMC_QUOTE_URL}${params.coinId}&${CMC_API_KEY}${apiKey}`
    );
    const data = await response.json();

    if (data.status.error_code !== 0) {
      return new Response("CMC API request error", {
        status: data.status.error_code,
      });
    }

    return new Response(
      JSON.stringify({
        liveValue: data.data[params.coinId].quote.USD.price,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Server error", {
      status: 500,
    });
  }
};
