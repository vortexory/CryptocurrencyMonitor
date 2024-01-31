"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import AddTransactionDialog from "./AddTransactionDialog";
import { Transaction, UserWallet } from "@/utils/interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@/providers/WalletProvider";

const ActionsCell = ({
  handleDeleteCoin,
  walletId,
  coinApiID,
  selectedWallet,
  setSelectedWallet,
  name,
  transactions,
  quantity,
  avgBuyPrice,
}: {
  handleDeleteCoin: (walletId: string, coinApiID: number) => Promise<void>;
  walletId: string;
  coinApiID: number;
  selectedWallet: UserWallet | null;
  setSelectedWallet: Dispatch<SetStateAction<UserWallet | null>>;
  name: string;
  transactions: Transaction[];
  quantity: number;
  avgBuyPrice: number;
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState<boolean>(false);

  const { setTransactionsView } = useWallet();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => setIsAddDialogOpen(true)}
            className="cursor-pointer"
          >
            Add coins
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsSellDialogOpen(true)}
            className="cursor-pointer"
          >
            Sell coins
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              setTransactionsView({
                open: true,
                coin: {
                  transactions,
                  quantity,
                  name,
                  avgBuyPrice,
                  coinApiID,
                },
              })
            }
          >
            Transactions
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleDeleteCoin(walletId, coinApiID)}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isAddDialogOpen && (
        <AddTransactionDialog
          walletId={selectedWallet?._id}
          setSelectedWallet={setSelectedWallet}
          coinApiID={coinApiID}
          type="buy"
          name={name}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          setIsModalOpen={setIsAddDialogOpen}
        />
      )}

      {isSellDialogOpen && (
        <AddTransactionDialog
          walletId={selectedWallet?._id}
          setSelectedWallet={setSelectedWallet}
          coinApiID={coinApiID}
          type="sell"
          name={name}
          open={isSellDialogOpen}
          onOpenChange={setIsSellDialogOpen}
          setIsModalOpen={setIsSellDialogOpen}
        />
      )}
    </>
  );
};

export default ActionsCell;
