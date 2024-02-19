"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useWatchlist } from "@/providers/WatchlistProvider";

const DeleteWatchlistDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedWatchlist, setWatchlists, setMainWatchlistAsSelected } =
    useWatchlist();

  const { mutateAsync: deleteWatchlistAsync, isPending } = useMutation({
    mutationFn: (payload: { userId: string; watchlistId: string }) => {
      return axios.patch("/api/watchlist/delete-watchlist", payload);
    },
    onSuccess: (res) => {
      setWatchlists(res.data.updatedWatchlists);
      setMainWatchlistAsSelected();
      toast({
        title: "Watchlist Deleted",
        description: "The watchlist has been deleted.",
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

  const { toast } = useToast();

  const { data } = useSession();

  const session = data as Session | null;

  const handleDeleteWatchlist = async () => {
    try {
      if (session?.user?.id && selectedWatchlist?._id) {
        const watchlistData = {
          userId: session.user.id,
          watchlistId: selectedWatchlist._id,
        };

        await deleteWatchlistAsync(watchlistData);
      }
    } catch (error) {
      console.error("Error deleting watchlist", error);
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
        disabled={!!selectedWatchlist?.main}
      >
        Delete watchlist
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete watchlist</DialogTitle>
        </DialogHeader>
        Are you sure you want to delete {selectedWatchlist?.name}?
        <DialogFooter className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            className="flex-1"
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteWatchlist}
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

export default DeleteWatchlistDialog;
