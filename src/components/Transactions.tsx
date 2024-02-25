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
import {
  calculateBoughtQty,
  calculateTotalSold,
  extractLastWord,
  formatDate,
  formatPrice,
} from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "./Loader";

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
      const response = await axios.get(`/api/external/get-value/${coinApiID}`);

      return response.data;
    },
    queryKey: ["coin"],
  });

  const totalSpent = (calculateBoughtQty(transactions) * avgBuyPrice).toFixed(
    2
  );
  const liveValue = (quantity * data?.liveValue).toFixed(2);
  const totalSold = calculateTotalSold(transactions);

  const difference = (+liveValue + totalSold - +totalSpent).toFixed(2);

  const isProfitable = +difference > 0;
  const percentage = (+difference / +totalSpent) * 100;

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
    <Loader />
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
            {quantity} {extractLastWord(name)}
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
            {isProfitable && "+"}
            {formatPrice(+difference)}

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
                {formatPrice(percentage, false)}%
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
          {transactions
            ?.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);

              return dateB.valueOf() - dateA.valueOf();
            })
            .map((transaction) => (
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
