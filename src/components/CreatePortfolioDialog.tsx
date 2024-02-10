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
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const CreatePortfolioDialog = () => {
  const [walletName, setWalletName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data } = useSession();

  const session = data as Session | null;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newWallet: { userId: string; walletName: string }) => {
      return axios.post("/api/wallet/new", newWallet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Wallet created",
        description: "Your wallet has been created successfully.",
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

  const handleWalletCreation = async () => {
    try {
      if (session?.user?.id && walletName) {
        const newWalletData = {
          userId: session.user.id,
          walletName: walletName,
        };

        await mutateAsync(newWalletData);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setIsModalOpen(false);
      setWalletName("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <PlusIcon className="mr-2" /> Create portfolio
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new portfolio</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col gap-3">
          <Input
            placeholder="Search"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />

          <Button
            type="button"
            onClick={handleWalletCreation}
            disabled={isPending}
          >
            Create
          </Button>
        </div>

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

export default CreatePortfolioDialog;
