"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon, StarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { CoinData, Session } from "@/utils/interfaces";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

const AddCoinToWatchlistDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const { data } = useSession();

  const { toast } = useToast();

  const session = data as Session | null;

  const queryClient = useQueryClient();

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

  const handleAddCoin = async () => {};

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button onClick={() => setIsModalOpen(true)}>
        <PlusIcon className="mr-2" /> Add asset
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a coin</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col gap-3">
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

          <div className="flex flex-col gap-3">
            {isLoading || isFetching ? (
              <div>Loading...</div>
            ) : hasSearched ? (
              coins?.length > 0 ? (
                coins.map((coinObj: any) => {
                  const coin: CoinData = coinObj[Object.keys(coinObj)[0]];
                  return (
                    <Badge
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
                      <StarIcon
                        className="h-5 w-5 text-[#f6b97e] cursor-pointer"
                        fill="#f6b97e"
                      />
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
              disabled={!searchTerm || isLoading}
              onClick={searchCoin}
            >
              Search
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>
          <Button>Add selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoinToWatchlistDialog;
