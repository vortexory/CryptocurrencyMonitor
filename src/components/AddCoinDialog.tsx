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

const AddCoinDialog = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const {
    data: coin,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const response = await fetch(`api/getCoin?symbol=${inputValue}`);

      return response.json();
    },
    queryKey: ["coin"],
    enabled: false,
  });

  const searchTerm = inputValue.trim().length > 0;

  const searchCoin = () => {
    if (searchTerm) {
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
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="button" disabled={!searchTerm} onClick={searchCoin}>
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
