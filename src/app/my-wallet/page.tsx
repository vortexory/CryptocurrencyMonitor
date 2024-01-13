"use client";

import Wallet from "@/components/Wallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const page = () => {
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);

  const { data } = useSession();

  const session = data as Session;

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

  return (
    <div className="wrapper flex gap-10">
      <div className="flex-1 flex flex-col gap-4">
        <Wallet
          walletName="Overview"
          selected={!selectedWallet}
          totalValue={totalWalletsValue}
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
                    totalValue={wallet.totalValue}
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
                <AvatarImage src="" alt="" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground font-bold">Crypto</p>
            </div>
            <h3 className="mt-3">
              ${selectedWallet ? selectedWallet.totalValue : totalWalletsValue}
            </h3>
          </div>

          <div className="w-2/3 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground font-bold">
              Progress towards your goal - $20,000
            </p>
            <Progress value={50} />
          </div>
        </div>

        <div className="flex gap-6">
          <Card>
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

          <Card>
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

          <Card>
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
              <AddCoinDialog />
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>1h %</TableHead>
                <TableHead>24h %</TableHead>
                <TableHead>7d %</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Volume(24h)</TableHead>
                <TableHead>Circulating Supply</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Bitcoin BTC</TableCell>
                <TableCell>$44,000.55</TableCell>
                <TableCell className="text-green-500">3%</TableCell>
                <TableCell className="text-red-500">-5%</TableCell>
                <TableCell className="text-green-500">7%</TableCell>
                <TableHead>$871,718,020,693</TableHead>
                <TableHead>$24,349,067,552</TableHead>
                <TableHead>19,564,418 BTC</TableHead>
                <TableHead>
                  <ActionsCell />
                </TableHead>
              </TableRow>

              <TableRow>
                <TableCell>Bitcoin BTC</TableCell>
                <TableCell>$44,000.55</TableCell>
                <TableCell className="text-green-500">3%</TableCell>
                <TableCell className="text-red-500">-5%</TableCell>
                <TableCell className="text-green-500">7%</TableCell>
                <TableHead>$871,718,020,693</TableHead>
                <TableHead>$24,349,067,552</TableHead>
                <TableHead>19,564,418 BTC</TableHead>
                <TableHead>
                  <ActionsCell />
                </TableHead>
              </TableRow>

              <TableRow>
                <TableCell>Bitcoin BTC</TableCell>
                <TableCell>$44,000.55</TableCell>
                <TableCell className="text-green-500">3%</TableCell>
                <TableCell className="text-red-500">-5%</TableCell>
                <TableCell className="text-green-500">7%</TableCell>
                <TableHead>$871,718,020,693</TableHead>
                <TableHead>$24,349,067,552</TableHead>
                <TableHead>19,564,418 BTC</TableHead>
                <TableHead>
                  <ActionsCell />
                </TableHead>
              </TableRow>

              <TableRow>
                <TableCell>Bitcoin BTC</TableCell>
                <TableCell>$44,000.55</TableCell>
                <TableCell className="text-green-500">3%</TableCell>
                <TableCell className="text-red-500">-5%</TableCell>
                <TableCell className="text-green-500">7%</TableCell>
                <TableHead>$871,718,020,693</TableHead>
                <TableHead>$24,349,067,552</TableHead>
                <TableHead>19,564,418 BTC</TableHead>
                <TableHead>
                  <ActionsCell />
                </TableHead>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default page;
