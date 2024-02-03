"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { Session, Watchlist } from "@/utils/interfaces";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  PenIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const page = () => {
  const [dropdownOpen, setDropDownOpen] = useState<boolean>(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null
  );

  const { data, status } = useSession();

  const session = data as Session;

  useEffect(() => {
    if (session?.user) {
      const mainWatchlist =
        session?.user?.watchlists.find((watchlist) => watchlist.main) ?? null;

      setSelectedWatchlist(mainWatchlist);
    }
  }, [session?.user]);

  return (
    <div className="wrapper">
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex-container-center justify-between gap-4">
            <div className="max-w-[65%]">
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
                  {session?.user?.watchlists.map((watchlist) => (
                    <div
                      key={watchlist._id}
                      className="flex-container-center gap-3 cursor-pointer px-2 py-1 rounded-md hover:bg-secondary"
                    >
                      <p className="text-md">{watchlist.name}</p>
                      {watchlist.main && (
                        <Badge className="hover:bg-primary">Main</Badge>
                      )}
                    </div>
                  ))}

                  <DropdownMenuSeparator />
                  <Button variant="ghost">
                    <PlusIcon className="mr-2" />
                    New Watchlist
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedWatchlist?.description && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {selectedWatchlist.description}
                </p>
              )}
            </div>

            <div className="flex-container-center gap-2">
              <Button>
                <PlusIcon className="mr-2" />
                New asset
              </Button>
              <Button variant="secondary">
                <PenIcon className="mr-2 h-5 w-5" />
                Edit
              </Button>
            </div>
          </div>

          <div className="mt-12">
            {selectedWatchlist?.coins.length ? (
              <Table className="max-w-[50%]">
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-right">#</TableHead>
                    <TableHead className="text-right">Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedWatchlist.coins.map((coin, i) => (
                    <TableRow>
                      <TableCell className="w-14">
                        <StarIcon className="h-5 w-5" />
                      </TableCell>
                      <TableCell className="w-14" align="right">
                        {i + 1}
                      </TableCell>
                      <TableCell align="right">{coin.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>This list does not contain any coins yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default page;
