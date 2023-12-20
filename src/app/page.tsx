"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: cryptocurrencies, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(`api/cryptoData`);

      return response.json();
    },
    queryKey: ["cryptocurrencies"],
  });

  return (
    <main className="wrapper">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-4 rounded-sm" />
          <Skeleton className="w-full h-4 rounded-sm" />
          <Skeleton className="w-full h-4 rounded-sm" />
          <Skeleton className="w-full h-4 rounded-sm" />
          <Skeleton className="w-full h-4 rounded-sm" />
        </div>
      ) : (
        <Table>
          <TableCaption>
            A list of the most popular cryptocurrencies.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>1h %</TableHead>
              <TableHead>24h %</TableHead>
              <TableHead>7d %</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Volume(24h)</TableHead>
              <TableHead>Circulating Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptocurrencies?.data?.map((coin: CryptoData) => (
              <TableRow>
                <TableCell className="font-medium">{coin.cmc_rank}</TableCell>
                <TableCell>{`${coin.name} ${coin.symbol}`}</TableCell>
                <TableCell>{coin.quote.USD.price}</TableCell>
                <TableCell className="text-green-500">
                  {coin.quote.USD.percent_change_1h}%
                </TableCell>
                <TableCell className="text-red-500">
                  {coin.quote.USD.percent_change_24h}%
                </TableCell>
                <TableCell className="text-green-500">
                  {coin.quote.USD.percent_change_7d}%
                </TableCell>
                <TableHead>{coin.quote.USD.market_cap}</TableHead>
                <TableHead>{coin.quote.USD.volume_24h}%</TableHead>
                <TableHead>{coin.circulating_supply}</TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
