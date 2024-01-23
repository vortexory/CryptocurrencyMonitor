"use client";

import Wallet from "@/components/Wallet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PieChart } from "react-minimal-pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionsCell from "@/components/ActionsCell";
import { Progress } from "@/components/ui/progress";
import AddCoinDialog from "@/components/AddCoinDialog";
import CreatePortfolioDialog from "@/components/CreatePortfolioDialog";
import { useSession } from "next-auth/react";
import { Session, UserWallet } from "@/utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  aggregateCoins,
  calculateAvgBuyPrice,
  calculateCoinValue,
  formatPrice,
  getColorByIndex,
} from "@/utils/functions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import AddEditGoalDialog from "@/components/AddEditGoalDialog";
import DeletePortfolioDialog from "@/components/DeletePortfolioDialog";

const page = () => {
  const { data } = useSession();

  const session = data as Session;

  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const [walletsValueGoal, setWalletsValueGoal] = useState<number>(0);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data: userWallets, isLoading } = useQuery<UserWallet[]>({
    queryFn: async () => {
      const response = await axios.get(
        `/api/wallet/get-user-wallets/${session?.user?.id}`
      );

      return response.data;
    },
    enabled: !!session?.user?.id,
    queryKey: ["wallets"],
  });

  const totalWalletsValue =
    userWallets?.reduce((sum, wallet) => sum + wallet.totalValue, 0) ?? 0;

  const { mutateAsync } = useMutation({
    mutationFn: (coin: {
      userId: string;
      walletId: string;
      coinApiID: number;
    }) => {
      return axios.patch("/api/wallet/delete-coin", coin);
    },
    onSuccess: (res) => {
      setSelectedWallet(res.data);
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Coin Deleted",
        description: "The coin has been deleted from the wallet.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was a problem with your request.",
      });
    },
  });

  const handleDeleteCoin = async (walletId: string, coinApiID: number) => {
    try {
      if (session?.user?.id) {
        const coinData = {
          userId: session.user.id,
          walletId,
          coinApiID,
        };

        await mutateAsync(coinData);
      }
    } catch (error) {
      console.error("Error deleting coin", error);
    }
  };

  const coinsToDisplay = selectedWallet
    ? selectedWallet.coins
    : aggregateCoins(userWallets ?? []);

  const coinsWithTotalValue = coinsToDisplay
    .map((coin) => calculateCoinValue(coin))
    .sort((a, b) => b.value - a.value)
    .map((coin, index) => ({
      ...coin,
      color: getColorByIndex(index),
    }));

  const topCoins = coinsWithTotalValue.slice(0, 7);

  const others =
    coinsWithTotalValue.length > 7
      ? {
          name: "Others",
          value: coinsWithTotalValue
            .slice(7)
            .reduce((acc, coin) => acc + coin.value, 0),
          color: getColorByIndex(7),
        }
      : null;

  const finalCoins = others ? topCoins.concat(others) : topCoins;

  useEffect(() => {
    if (session?.user?.id) {
      setWalletsValueGoal(session.user.walletsValueGoal);
    }
  }, [session]);

  return (
    <div className="wrapper flex gap-10">
      <div className="flex-1 flex flex-col gap-4">
        <Wallet
          walletName="Overview"
          selected={!selectedWallet}
          totalValue={formatPrice(totalWalletsValue)}
          onClick={() => setSelectedWallet(null)}
        />
        <div className="h-[1px] bg-foreground" />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>My portfolios ({userWallets?.length})</p>
            <div className="flex flex-col gap-4">
              <div className="max-h-[540px] overflow-y-auto flex flex-col gap-4 px-2">
                {userWallets?.map((wallet) => (
                  <Wallet
                    key={wallet._id}
                    walletName={wallet.name}
                    totalValue={formatPrice(wallet.totalValue)}
                    onClick={() => setSelectedWallet(wallet)}
                    selected={wallet._id === selectedWallet?._id}
                  />
                ))}
              </div>
              <CreatePortfolioDialog />
            </div>
          </>
        )}
      </div>
      <div className="flex-[4] flex flex-col gap-12">
        <div className="flex justify-between gap-12">
          <div>
            <div className="flex-container-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {selectedWallet ? selectedWallet.name.charAt(0) : "O"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground font-bold">
                {selectedWallet ? selectedWallet.name : "Overview"}
              </p>
            </div>
            <h3 className="mt-3">
              {selectedWallet
                ? formatPrice(selectedWallet.totalValue)
                : formatPrice(totalWalletsValue)}
            </h3>
          </div>

          <div className="w-2/3 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground font-bold">
              {walletsValueGoal
                ? `Progress towards your goal - ${formatPrice(
                    walletsValueGoal
                  )}`
                : "You haven't set a goal yet"}
            </p>
            <Progress
              value={
                walletsValueGoal
                  ? Math.min(
                      +((totalWalletsValue / walletsValueGoal) * 100),
                      100
                    )
                  : 0
              }
            />
            <AddEditGoalDialog
              setWalletsValueGoal={setWalletsValueGoal}
              walletsValueGoal={walletsValueGoal}
            />
          </div>
        </div>
        {selectedWallet && (
          <DeletePortfolioDialog
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
          />
        )}

        {finalCoins.length > 0 && (
          <div className="max-h-80">
            <Card>
              <CardHeader>
                <CardDescription className="font-bold">
                  Allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-12">
                  <PieChart
                    data={coinsWithTotalValue}
                    lineWidth={25}
                    style={{ height: "250px", flex: 1 }}
                  />
                  <div className="flex-1 flex flex-col items-center gap-3">
                    {finalCoins.map((coin, i) => {
                      const totalVal = selectedWallet
                        ? selectedWallet.totalValue
                        : totalWalletsValue;

                      return (
                        <div key={i} className="flex justify-between w-64">
                          <div className="flex-container-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full`}
                              style={{ backgroundColor: coin.color }}
                            />
                            <p className="text-sm font-bold">{coin.name}</p>
                          </div>
                          <p className="text-sm font-bold">
                            {((coin.value / totalVal) * 100).toFixed(2)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardDescription className="font-bold">
                All-time profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h5 className="mb-2 text-green-500">+$2,000</h5>
              <p className="text-green-500 text-sm">+19%</p>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardDescription className="font-bold">
                Best Performer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h5 className="mb-2">Ethereum ETH</h5>
              <div className="flex-container-center gap-2">
                <p className="text-green-500 text-sm">+$1,500</p>
                <p className="text-green-500 text-sm">+165%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardDescription className="font-bold">
                Worst Performer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h5 className="mb-2">Render RNDR</h5>
              <div className="flex-container-center gap-2">
                <p className="text-red-500 text-sm">-$230</p>
                <p className="text-red-500 text-sm">-6%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="">
          <h5 className="mb-2">Assets</h5>

          <Table>
            <TableCaption>
              {selectedWallet && (
                <AddCoinDialog
                  walletId={selectedWallet?._id}
                  setSelectedWallet={setSelectedWallet}
                />
              )}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Buy Price</TableHead>
                {selectedWallet && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {coinsToDisplay.map((coin) => (
                <TableRow key={coin._id}>
                  <TableCell>{coin.name}</TableCell>
                  <TableCell className="text-right">
                    {coin.transactions
                      .map(
                        (transaction: {
                          quantity: number;
                          pricePerCoin: number;
                        }) => transaction.quantity
                      )
                      .reduce(
                        (acc: number, currentVal: number) => acc + currentVal,
                        0
                      )}
                  </TableCell>
                  <TableCell className="text-right">
                    {calculateAvgBuyPrice(coin.transactions)}
                  </TableCell>
                  {selectedWallet && (
                    <TableCell className="text-right">
                      <ActionsCell
                        handleDeleteCoin={handleDeleteCoin}
                        walletId={selectedWallet._id}
                        coinApiID={coin.coinApiID}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default page;
