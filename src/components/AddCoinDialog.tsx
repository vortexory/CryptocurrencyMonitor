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
import { PlusIcon, ChevronRight } from "lucide-react";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import {
  CoinData,
  SelectedCoinInfo,
  Session,
  UserWallet,
} from "@/utils/interfaces";
import { useWallet } from "@/providers/WalletProvider";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/utils/functions";
import ClipLoader from "react-spinners/ClipLoader";

const AddCoinDialog = ({
  walletId,
  setSelectedWallet,
}: {
  walletId: string | undefined;
  setSelectedWallet: Dispatch<SetStateAction<UserWallet | null>>;
}) => {
  const { data } = useSession();

  const { toast } = useToast();

  const session = data as Session | null;

  const queryClient = useQueryClient();

  const { selectedCoin, selectCoin, unselectCoin } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedCoinInfo, setSelectedCoinInfo] = useState<SelectedCoinInfo>({
    quantity: 0,
    pricePerCoin: 0,
  });

  const {
    data: coins,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      const response = await fetch(`api/getCoins?symbol=${inputValue}`);

      return response.json();
    },
    queryKey: ["coins"],
    enabled: false,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (coin: {
      userId: string;
      walletId: string;
      coinName: string;
      coinApiID: number;
      quantity: number;
      pricePerCoin: number;
    }) => {
      return axios.post("/api/wallet/add-coin", coin);
    },
    onSuccess: (res) => {
      setSelectedWallet(res.data);
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Coin Added",
        description: "The coin has been added to the wallet.",
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

  const searchTerm = inputValue.trim().length > 0;

  const searchCoin = () => {
    if (searchTerm) {
      if (!hasSearched) {
        setHasSearched(true);
      }
      refetch();
    }
  };

  const handleAddCoin = async () => {
    try {
      if (
        session?.user?.id &&
        walletId &&
        selectedCoin?.id &&
        selectedCoinInfo.quantity &&
        selectedCoinInfo.pricePerCoin
      ) {
        const coinData = {
          userId: session.user.id,
          walletId: walletId,
          coinName: `${selectedCoin.name} ${selectedCoin.symbol}`,
          coinApiID: selectedCoin.id,
          quantity: selectedCoinInfo.quantity,
          pricePerCoin: selectedCoinInfo.pricePerCoin,
        };

        await mutateAsync(coinData);
      }
    } catch (error) {
      console.error("Error adding coin", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const resetDialogState = () => {
    unselectCoin();
    setSelectedCoinInfo({
      quantity: 0,
      pricePerCoin: 0,
    });
    setInputValue("");
    setHasSearched(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      resetDialogState();
    }
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        variant="outline"
        className="w-full md:w-fit mx-auto"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusIcon className="mr-2" /> Add asset
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a coin</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col gap-6">
          {!selectedCoin ? (
            <>
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={(e) => {
                  if (hasSearched) {
                    setHasSearched(false);
                  }

                  setInputValue(e.target.value);
                }}
              />

              <div className="flex flex-col gap-6">
                {isLoading || isFetching ? (
                  <ClipLoader
                    color="#fff"
                    loading
                    cssOverride={{
                      display: "block",
                      margin: "0 auto",
                    }}
                    size={50}
                  />
                ) : hasSearched ? (
                  coins?.length > 0 ? (
                    coins.map((coinObj: any) => {
                      const coin: CoinData = coinObj[Object.keys(coinObj)[0]];
                      return (
                        <Badge
                          onClick={() => {
                            selectCoin(coin);

                            if (coin.quote.USD.price) {
                              setSelectedCoinInfo((prev) => ({
                                ...prev,
                                pricePerCoin: coin.quote.USD.price ?? 0,
                              }));
                            }
                          }}
                          className="py-2 rounded-md w-full cursor-pointer flex-container-center justify-between"
                          key={coin.id}
                          variant="secondary"
                        >
                          <p>
                            {coin.name} {coin.symbol} -{" "}
                            {coin.quote.USD.price
                              ? `$${coin.quote.USD.price.toFixed(2)}`
                              : "Price not provided"}
                          </p>
                          <ChevronRight />
                        </Badge>
                      );
                    })
                  ) : (
                    <Badge className="py-2" variant="destructive">
                      Coin not found
                    </Badge>
                  )
                ) : null}
                <Button
                  type="button"
                  disabled={!searchTerm || isLoading || isFetching}
                  onClick={searchCoin}
                >
                  Search
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                value={`${selectedCoin.name} ${selectedCoin.symbol}`}
                disabled
              />
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
                onClick={handleAddCoin}
              >
                Add Transaction
              </Button>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          {selectedCoin && (
            <Button
              type="button"
              variant="outline"
              onClick={resetDialogState}
              disabled={isPending}
            >
              Back
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoinDialog;
