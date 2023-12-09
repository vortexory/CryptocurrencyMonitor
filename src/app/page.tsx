"use client";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(cryptocurrencies);

  return (
    <main className="wrapper">
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
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Bitcoin BTC</TableCell>
            <TableCell>$44,000.55</TableCell>
            <TableCell className="text-green-500">3%</TableCell>
            <TableCell className="text-red-500">-5%</TableCell>
            <TableCell className="text-green-500">7%</TableCell>
            <TableHead>$871,718,020,693</TableHead>
            <TableHead>$24,349,067,552</TableHead>
            <TableHead>19,564,418 BTC</TableHead>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Bitcoin BTC</TableCell>
            <TableCell>$44,000.55</TableCell>
            <TableCell className="text-green-500">3%</TableCell>
            <TableCell className="text-red-500">-5%</TableCell>
            <TableCell className="text-green-500">7%</TableCell>
            <TableHead>$871,718,020,693</TableHead>
            <TableHead>$24,349,067,552</TableHead>
            <TableHead>19,564,418 BTC</TableHead>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Bitcoin BTC</TableCell>
            <TableCell>$44,000.55</TableCell>
            <TableCell className="text-green-500">3%</TableCell>
            <TableCell className="text-red-500">-5%</TableCell>
            <TableCell className="text-green-500">7%</TableCell>
            <TableHead>$871,718,020,693</TableHead>
            <TableHead>$24,349,067,552</TableHead>
            <TableHead>19,564,418 BTC</TableHead>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Bitcoin BTC</TableCell>
            <TableCell>$44,000.55</TableCell>
            <TableCell className="text-green-500">3%</TableCell>
            <TableCell className="text-red-500">-5%</TableCell>
            <TableCell className="text-green-500">7%</TableCell>
            <TableHead>$871,718,020,693</TableHead>
            <TableHead>$24,349,067,552</TableHead>
            <TableHead>19,564,418 BTC</TableHead>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
