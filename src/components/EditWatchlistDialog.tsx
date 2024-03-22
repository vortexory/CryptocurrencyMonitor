"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useWatchlist } from "@/providers/WatchlistProvider";
import { PenIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

const EditWatchlistDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlistDetails, setWatchlistDetails] = useState({
    name: "",
    description: "",
    main: false,
  });

  const { toast } = useToast();
  const { data } = useSession();

  const { selectedWatchlist, setSelectedWatchlist, setWatchlists } =
    useWatchlist();

  const session = data as Session | null;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: {
      userId: string;
      watchlistId: string;
      newName: string;
      newDescription: string;
      main: boolean;
    }) => {
      return axios.patch("/api/watchlist/edit", payload);
    },
    onSuccess: (res) => {
      setSelectedWatchlist(res.data.updatedWatchlist);
      setWatchlists(res.data.updatedWatchlists);
      queryClient.invalidateQueries({ queryKey: ["watchlists"] });
      toast({
        title: "Watchlist updated",
        description: "Your watchlist has been updated successfully.",
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

  const handleUpdateWatchlist = async () => {
    try {
      if (
        session?.user?.id &&
        selectedWatchlist?._id &&
        watchlistDetails.name
      ) {
        const payload = {
          userId: session.user.id,
          watchlistId: selectedWatchlist._id,
          newName:
            selectedWatchlist.name !== watchlistDetails.name
              ? watchlistDetails.name
              : "",
          newDescription:
            selectedWatchlist.description !== watchlistDetails.description
              ? watchlistDetails.description
              : "",
          main: watchlistDetails.main,
        };

        await mutateAsync(payload);
      }
    } catch (error) {
      console.error("Error updating watchlist: ", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const isEditBtnDisabled =
    (selectedWatchlist?.name === watchlistDetails.name &&
      selectedWatchlist?.description === watchlistDetails.description &&
      selectedWatchlist?.main === watchlistDetails.main) ||
    !watchlistDetails.name.trim();

  useEffect(() => {
    if (selectedWatchlist?._id) {
      setWatchlistDetails({
        name: selectedWatchlist.name,
        description: selectedWatchlist.description,
        main: selectedWatchlist.main,
      });
    }
  }, [selectedWatchlist, isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
        <PenIcon className="mr-2 h-5 w-5" />
        Edit
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit watchlist</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-6">
          <div className="label-input-container">
            <Label htmlFor="name">New name</Label>
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
            <Label htmlFor="description">New description</Label>
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

          <div className="flex-container-center gap-3">
            <Switch
              disabled={selectedWatchlist?.main}
              checked={watchlistDetails.main}
              onCheckedChange={(checked) =>
                setWatchlistDetails((prev) => ({ ...prev, main: checked }))
              }
            />
            <Label htmlFor="airplane-mode">Main watchlist</Label>
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
            disabled={isEditBtnDisabled || isPending}
            onClick={handleUpdateWatchlist}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWatchlistDialog;
