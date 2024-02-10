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
  calculateAvgPrices,
  calculateCoinValue,
  formatPrice,
  getColorByIndex,
} from "@/utils/functions";
import { useToast } from "@/components/ui/use-toast";
import AddEditGoalDialog from "@/components/AddEditGoalDialog";
import DeletePortfolioDialog from "@/components/DeletePortfolioDialog";
import Transactions from "@/components/Transactions";
import { useWallet } from "@/providers/WalletProvider";
import ClipLoader from "react-spinners/ClipLoader";

const page = () => {
  const { data } = useSession();

  const session = data as Session;

  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const [walletsValueGoal, setWalletsValueGoal] = useState<number>(0);

  const { transactionsView, setTransactionsView } = useWallet();

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

  const totalWalletsValue =
    userWallets?.reduce((sum, wallet) => sum + wallet.totalValue, 0) ?? 0;

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

  const handleChangeWallet = (wallet: UserWallet | null) => {
    setSelectedWallet(wallet);
    setTransactionsView({
      open: false,
      coin: null,
    });
  };

  useEffect(() => {
    if (session?.user?.id) {
      setWalletsValueGoal(session.user.walletsValueGoal);
    }
  }, [session]);

  return (
    <div className="wrapper flex flex-col lg:flex-row gap-10 md:gap-12">
      <div className="flex-1 flex flex-col gap-4">
        <Wallet
          walletName="Overview"
          selected={!selectedWallet}
          totalValue={formatPrice(totalWalletsValue)}
          onClick={() => handleChangeWallet(null)}
          color="#5178ff"
        />
        <div className="h-[1px] bg-foreground" />

        {isLoading ? (
          <ClipLoader
            color="#fff"
            loading
            cssOverride={{
              display: "block",
              margin: "8px auto 0px auto",
            }}
            size={50}
          />
        ) : (
          <>
            <p>My portfolios ({userWallets?.length})</p>
            <div className="flex flex-col gap-4">
              <div className="max-h-[340px] lg:max-h-[540px] overflow-y-auto flex flex-col gap-4 p-2">
                {userWallets?.map((wallet, i) => (
                  <Wallet
                    key={wallet._id}
                    walletName={wallet.name}
                    totalValue={formatPrice(wallet.totalValue)}
                    onClick={() => handleChangeWallet(wallet)}
                    selected={wallet._id === selectedWallet?._id}
                    color={getColorByIndex(i + 1)}
                  />
                ))}
              </div>
              <CreatePortfolioDialog />
            </div>
          </>
        )}
      </div>
      <div className="flex-[4] flex flex-col gap-12">
        {transactionsView.open ? (
          <Transactions
            transactions={transactionsView.coin?.transactions ?? []}
            quantity={transactionsView.coin?.quantity ?? 0}
            name={transactionsView.coin?.name ?? ""}
            avgBuyPrice={transactionsView.coin?.avgBuyPrice ?? 0}
            coinApiID={transactionsView.coin?.coinApiID ?? 0}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-start md:justify-between gap-4">
              <div className="flex flex-col items-center md:items-start">
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
                <h3 className="mt-4">
                  {selectedWallet
                    ? formatPrice(selectedWallet.totalValue)
                    : formatPrice(totalWalletsValue)}
                </h3>
              </div>

              {selectedWallet && (
                <DeletePortfolioDialog
                  selectedWallet={selectedWallet}
                  setSelectedWallet={setSelectedWallet}
                />
              )}
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-4">
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

            {finalCoins.length > 0 && (
              <Card>
                <CardHeader>
                  <CardDescription className="font-bold">
                    Allocation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-start md:justify-between gap-12">
                    <PieChart
                      data={coinsWithTotalValue}
                      lineWidth={25}
                      style={{ maxHeight: "250px", flex: 1 }}
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
            )}

            <h5 className="text-center md:text-start">Assets</h5>

            <div className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right min-w-[150px]">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right min-w-[150px]">
                      Avg. Buy Price
                    </TableHead>
                    <TableHead className="text-right min-w-[150px]">
                      Avg. Sell Price
                    </TableHead>

                    {selectedWallet && (
                      <TableHead className="text-right min-w-[150px]">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coinsToDisplay.map((coin) => {
                    return (
                      <TableRow key={coin._id}>
                        <TableCell>{coin.name}</TableCell>
                        <TableCell className="text-right">
                          {coin.totalQuantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(
                            calculateAvgPrices(coin.transactions).avgBuyPrice
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {calculateAvgPrices(coin.transactions).avgSellPrice
                            ? formatPrice(
                                calculateAvgPrices(coin.transactions)
                                  .avgSellPrice
                              )
                            : "-"}
                        </TableCell>
                        {selectedWallet && (
                          <TableCell className="text-right">
                            <ActionsCell
                              handleDeleteCoin={handleDeleteCoin}
                              walletId={selectedWallet._id}
                              coinApiID={coin.coinApiID}
                              selectedWallet={selectedWallet}
                              setSelectedWallet={setSelectedWallet}
                              name={coin.name}
                              transactions={coin.transactions}
                              quantity={coin.totalQuantity}
                              avgBuyPrice={
                                calculateAvgPrices(coin.transactions)
                                  .avgBuyPrice
                              }
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {selectedWallet && (
                <AddCoinDialog
                  walletId={selectedWallet?._id}
                  setSelectedWallet={setSelectedWallet}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
