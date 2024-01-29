import { Transaction } from "@/utils/interfaces";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";
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
import { formatDate } from "@/utils/functions";

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  const { setTransactionsView } = useWallet();

  useEffect(() => {
    setTransactionsView({
      open: true,
      transactions,
    });

    return () =>
      setTransactionsView({
        open: false,
        transactions: [],
      });
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className="w-fit"
        onClick={() =>
          setTransactionsView({
            open: false,
            transactions: [],
          })
        }
      >
        <ChevronLeftIcon /> Back
      </Button>
      <div className="flex-container-center gap-3">
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">Quantity</CardDescription>
          </CardHeader>
          <CardContent>Test</CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">
              Avg. buy price
            </CardDescription>
          </CardHeader>
          <CardContent>Test</CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardDescription className="font-bold">
              Total profit / loss
            </CardDescription>
          </CardHeader>
          <CardContent>Test</CardContent>
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
          {transactions.map((transaction) => (
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
                {transaction.pricePerCoin.toFixed(2)}
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
