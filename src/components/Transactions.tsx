import { Transaction } from "@/utils/interfaces";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronLeftIcon, ChevronUp } from "lucide-react";
import { useWallet } from "@/providers/WalletProvider";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { formatDate, formatPrice } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Transactions = ({
  transactions,
  quantity,
  name,
  avgBuyPrice,
  coinApiID,
}: {
  transactions: Transaction[];
  quantity: number;
  name: string;
  avgBuyPrice: number;
  coinApiID: number;
}) => {
  const { setTransactionsView } = useWallet();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axios.get(`/api/coin/get-value/${coinApiID}`);

      return response.data;
    },
    queryKey: ["coin"],
  });

  const isProfitable = data?.liveValue - avgBuyPrice > 0;

  useEffect(() => {
    setTransactionsView({
      open: true,
      coin: {
        transactions,
        quantity,
        name,
        avgBuyPrice,
        coinApiID,
      },
    });
    return () =>
      setTransactionsView({
        open: false,
        coin: null,
      });
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Button
        variant="ghost"
        className="w-fit"
        onClick={() =>
          setTransactionsView({
            open: false,
            coin: null,
          })
        }
      >
        <ChevronLeftIcon /> Back
      </Button>
      <div className="flex-container-center items-stretch gap-3">
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">Quantity</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl">
            {quantity} {name}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">
              Avg. buy price
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl">
            {formatPrice(avgBuyPrice)}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">
              Total profit / loss
            </CardDescription>
          </CardHeader>
          <CardContent
            className={`text-2xl ${
              isProfitable ? "text-green-500" : "text-red-500"
            }`}
          >
            {formatPrice(data.liveValue - avgBuyPrice)}

            <div className="mt-2 flex-container-center gap-[2px]">
              {isProfitable ? (
                <ChevronUp className="text-green-500 h-4" />
              ) : (
                <ChevronDown className="text-red-500 h-4" />
              )}
              <p
                className={`text-sm ${
                  isProfitable ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatPrice(
                  ((data.liveValue - avgBuyPrice) / avgBuyPrice) * 100,
                  false
                )}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>
                <div className="flex-container-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {transaction.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </p>
                    <p>{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(transaction.pricePerCoin)}
              </TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Transactions;
