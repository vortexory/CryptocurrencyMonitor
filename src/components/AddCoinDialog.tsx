"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { CoinData } from "@/utils/interfaces";

const AddCoinDialog = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

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

  const searchTerm = inputValue.trim().length > 0;

  const searchCoin = () => {
    if (searchTerm) {
      if (!hasSearched) {
        setHasSearched(true);
      }
      refetch();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusIcon className="mr-2" /> Add asset
        </Button>
      </DialogTrigger>
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

          <div className="my-2">
            {isLoading || isFetching ? (
              <div>Loading...</div>
            ) : hasSearched ? (
              coins?.length > 0 ? (
                coins.map((coinObj: any) => {
                  const coin: CoinData = coinObj[Object.keys(coinObj)[0]];
                  return (
                    <Badge
                      className="py-2 cursor-pointer"
                      key={coin.id}
                      variant="secondary"
                    >
                      {coin.name} {coin.symbol} -{" "}
                      {coin.quote.USD.price
                        ? `$${coin.quote.USD.price}`
                        : "Price not provided"}
                    </Badge>
                  );
                })
              ) : (
                <Badge className="py-2" variant="destructive">
                  Coin not found
                </Badge>
              )
            ) : null}
          </div>

          <Button
            type="button"
            disabled={!searchTerm || isLoading}
            onClick={searchCoin}
          >
            Search
          </Button>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoinDialog;
