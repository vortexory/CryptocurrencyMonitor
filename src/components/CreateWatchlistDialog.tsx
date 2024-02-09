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
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useWatchlist } from "@/providers/WatchlistProvider";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

const CreateWatchlistDialog = ({
  open,
  onOpenChange,
  setIsModalOpen,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [watchlistDetails, setWatchlistDetails] = useState({
    name: "",
    description: "",
  });

  const { toast } = useToast();
  const { data } = useSession();
  const { setSelectedWatchlist, setWatchlists } = useWatchlist();

  const session = data as Session | null;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newWatchlist: {
      userId: string;
      watchlistName: string;
      description: string;
    }) => {
      return axios.post("/api/watchlist/add-watchlist", newWatchlist);
    },
    onSuccess: (res) => {
      setWatchlists(res.data.updatedWatchlists);
      setSelectedWatchlist(res.data.newWatchlist);
      toast({
        title: "Watchlist created",
        description: "Your watchlist has been created successfully.",
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

  const handleWatchlistCreation = async () => {
    try {
      if (session?.user?.id) {
        const newWatchlistData = {
          userId: session.user.id,
          watchlistName: watchlistDetails.name,
          description: watchlistDetails.description,
        };

        await mutateAsync(newWatchlistData);
      }
    } catch (error) {
      console.error("Error creating watchlist: ", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new watchlist</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col gap-6">
          <div className="label-input-container">
            <Label htmlFor="name">Watchlist name</Label>
            <Input
              id="name"
              placeholder="My watchlist"
              value={watchlistDetails.name}
              onChange={(e) =>
                setWatchlistDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="label-input-container">
            <Label htmlFor="description">Watchlist description</Label>
            <Textarea
              id="description"
              placeholder="This is an awesome watchlist"
              className="resize-none"
              value={watchlistDetails.description}
              onChange={(e) =>
                setWatchlistDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleWatchlistCreation}
            disabled={
              isPending || !!(watchlistDetails.name.trim().length === 0)
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWatchlistDialog;
