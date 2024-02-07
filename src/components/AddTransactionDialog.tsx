"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SelectedCoinInfo,
  Session,
  TransactionType,
  UserWallet,
} from "@/utils/interfaces";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/utils/functions";
import ClipLoader from "react-spinners/ClipLoader";

const AddTransactionDialog = ({
  walletId,
  setSelectedWallet,
  coinApiID,
  type,
  name,
  open,
  onOpenChange,
  setIsModalOpen,
}: {
  walletId: string | undefined;
  setSelectedWallet: Dispatch<SetStateAction<UserWallet | null>>;
  coinApiID: number;
  type: TransactionType;
  name: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data } = useSession();

  const { toast } = useToast();

  const session = data as Session | null;

  const queryClient = useQueryClient();

  const [selectedCoinInfo, setSelectedCoinInfo] = useState<SelectedCoinInfo>({
    quantity: 0,
    pricePerCoin: 0,
  });

  const { data: coin, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axios.get(`/api/coin/get-value/${coinApiID}`);

      return response.data;
    },
    queryKey: ["coin"],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (coin: {
      userId: string;
      walletId: string;
      coinApiID: number;
      quantity: number;
      pricePerCoin: number;
      type: string;
    }) => {
      return axios.post("/api/wallet/add-transaction", coin);
    },
    onSuccess: (res) => {
      setSelectedWallet(res.data);
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Transaction added",
        description: "The transaction has been added.",
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

  const handleAddTransaction = async () => {
    try {
      if (
        session?.user?.id &&
        walletId &&
        selectedCoinInfo.quantity &&
        selectedCoinInfo.pricePerCoin
      ) {
        const coinData = {
          userId: session.user.id,
          walletId: walletId,
          coinApiID,
          quantity: selectedCoinInfo.quantity,
          pricePerCoin: selectedCoinInfo.pricePerCoin,
          type,
        };

        await mutateAsync(coinData);
      }
    } catch (error) {
      console.error("Error adding transaction", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const resetDialogState = () => {
    setSelectedCoinInfo({
      quantity: 0,
      pricePerCoin: 0,
    });
  };

  useEffect(() => {
    if (coin) {
      setSelectedCoinInfo((prev) => ({
        ...prev,
        pricePerCoin: coin.liveValue,
      }));
    }

    if (!open) {
      resetDialogState();
    }
  }, [coin, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a coin</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <ClipLoader
            color="#fff"
            loading
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
            size={50}
          />
        ) : (
          <div className="my-2 flex flex-col gap-3">
            <>
              <Input value={name} disabled />
              <div className="flex-container-center gap-2">
                <div className="flex flex-col gap-2 flex-1">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0.00"
                    value={selectedCoinInfo.quantity}
                    onChange={(e) =>
                      setSelectedCoinInfo((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Label htmlFor="ppc">Price Per Coin</Label>
                  <Input
                    id="ppc"
                    type="number"
                    placeholder="0.00"
                    value={selectedCoinInfo.pricePerCoin.toFixed(2)}
                    onChange={(e) =>
                      setSelectedCoinInfo((prev) => ({
                        ...prev,
                        pricePerCoin: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="bg-secondary p-3 rounded-md">
                <h6 className="font-bold mb-1">Total Spent</h6>
                <p>
                  {formatPrice(
                    selectedCoinInfo.quantity * selectedCoinInfo.pricePerCoin
                  )}
                </p>
              </div>
              <Button
                type="button"
                disabled={
                  !selectedCoinInfo.quantity ||
                  !selectedCoinInfo.pricePerCoin ||
                  isPending
                }
                onClick={handleAddTransaction}
              >
                Add Transaction
              </Button>
            </>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
