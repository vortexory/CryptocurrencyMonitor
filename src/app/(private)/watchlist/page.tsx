"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Session } from "@/utils/interfaces";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, PlusIcon, StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateWatchlistDialog from "@/components/CreateWatchlistDialog";
import AddCoinToWatchlistDialog from "@/components/AddCoinToWatchlistDialog";
import { useWatchlist } from "@/providers/WatchlistProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import EditWatchlistDialog from "@/components/EditWatchlistDialog";
import { redirect } from "next/navigation";
import Loader from "@/components/Loader";
import DeleteWatchlistDialog from "@/components/DeleteWatchlistDialog";

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropDownOpen] = useState<boolean>(false);

  const { data, status } = useSession();
  const { watchlists, selectedWatchlist, setWatchlists, setSelectedWatchlist } =
    useWatchlist();

  const session = data as Session;

  const { mutateAsync } = useMutation({
    mutationFn: (payload: {
      userId: string;
      watchlistId: string;
      id: number;
    }) => {
      return axios.patch("/api/watchlist/remove-coin", payload);
    },
    onSuccess: (res) => {
      setSelectedWatchlist(res.data);
      toast({
        title: "Coin removed",
        description: "The coin has been deleted from your wallet.",
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

  const handleRemoveCoin = async (id: number) => {
    try {
      if (session?.user?.id && selectedWatchlist?._id) {
        const payload = {
          userId: session.user.id,
          watchlistId: selectedWatchlist._id,
          id,
        };

        await mutateAsync(payload);
      }
    } catch (error) {
      console.error("Error removing transaction: ", error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      const mainWatchlist =
        session.user.watchlists.find((watchlist) => watchlist.main) ?? null;

      setWatchlists(session.user.watchlists);
      setSelectedWatchlist(mainWatchlist);
    }
  }, [session?.user]);

  if (status === "loading") {
    return (
      <div className="wrapper">
        <Loader />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/signin");
  }

  return (
    <div className="wrapper">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="w-full md:w-2/3">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
            <DropdownMenuTrigger className="outline-none ring-0">
              <div className="flex-container-center gap-1">
                <h4 className="text-2xl">{selectedWatchlist?.name}</h4>
                {dropdownOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 p-3 min-w-[250px] max-w-full">
              <div className="max-h-56 flex flex-col gap-2 overflow-y-auto">
                {watchlists.map((watchlist) => (
                  <DropdownMenuItem
                    key={watchlist._id}
                    className={`${
                      selectedWatchlist?._id.toString() ===
                        watchlist._id.toString() && "bg-secondary"
                    }  flex-container-center gap-3 cursor-pointer`}
                    onClick={() =>
                      setTimeout(() => {
                        setSelectedWatchlist(watchlist);
                      }, 200)
                    }
                  >
                    <p className="text-md">{watchlist.name}</p>
                    {watchlist.main && (
                      <Badge className="hover:bg-primary">Main</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex-container-center justify-center cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="mr-2" />
                New Watchlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isModalOpen && (
            <CreateWatchlistDialog
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {selectedWatchlist?.description && (
            <p className="text-sm mt-2 text-muted-foreground">
              {selectedWatchlist.description}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <EditWatchlistDialog />
          <DeleteWatchlistDialog />
        </div>
      </div>

      <div className="mt-12">
        {selectedWatchlist?.coins.length ? (
          <div className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedWatchlist.coins.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell className="w-14">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <StarIcon
                              className="h-5 w-5 text-[#f6b97e] cursor-pointer"
                              fill="#f6b97e"
                              onClick={() => handleRemoveCoin(coin.id)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from watchlist</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="w-14" align="right">
                      {coin.cmcRank}
                    </TableCell>
                    <TableCell align="right">{coin.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AddCoinToWatchlistDialog />
          </div>
        ) : (
          <p>This list does not contain any coins yet.</p>
        )}
      </div>
    </div>
  );
};

export default page;
