"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session, UserWallet } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const DeletePortfolioDialog = ({
  selectedWallet,
  setSelectedWallet,
}: {
  selectedWallet: UserWallet | null;
  setSelectedWallet: Dispatch<SetStateAction<UserWallet | null>>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: deleteWalletAsync, isPending } = useMutation({
    mutationFn: (wallet: { userId: string; walletId: string }) => {
      return axios.patch("/api/wallet/delete-wallet", wallet);
    },
    onSuccess: () => {
      setSelectedWallet(null);
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Wallet Deleted",
        description: "The wallet has been deleted.",
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

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data } = useSession();

  const session = data as Session | null;

  const handleDeleteWallet = async () => {
    try {
      if (session?.user?.id && selectedWallet) {
        const walletData = {
          userId: session.user.id,
          walletId: selectedWallet._id,
        };

        await deleteWalletAsync(walletData);
      }
    } catch (error) {
      console.error("Error deleting wallet", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        className="w-full md:w-fit"
        variant="destructive"
        onClick={() => setIsModalOpen(true)}
        disabled={!selectedWallet}
      >
        Delete portfolio
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete portfolio</DialogTitle>
        </DialogHeader>
        Are you sure you want to delete {selectedWallet?.name}?
        <DialogFooter className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteWallet}
            className="flex-1"
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePortfolioDialog;
