"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, PenIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

const page = () => {
  const [dropdownOpen, setDropDownOpen] = useState<boolean>(false);

  return (
    <div className="wrapper">
      <div className="flex-container-center justify-between gap-4">
        <div className="max-w-[65%]">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
            <DropdownMenuTrigger className="outline-none ring-0">
              <div className="flex-container-center gap-1">
                <h4 className="text-2xl">Test</h4>
                {dropdownOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 p-3 min-w-[250px] max-w-full">
              <div className="flex-container-center gap-3 cursor-pointer px-2 py-1 rounded-md hover:bg-secondary">
                <p className="text-md">Watchlist 1</p>
                <Badge className="hover:bg-primary">Main</Badge>
              </div>

              <DropdownMenuSeparator />
              <Button variant="ghost">
                <PlusIcon className="mr-2" />
                New Watchlist
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-sm mt-2 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At minima
            sapiente eveniet deserunt quo maxime error soluta dicta recusandae
            impedit nulla et, corporis, rerum iure illo quisquam ea? Voluptates
            fugit eligendi perferendis alias nisi corporis numquam sunt, autem
            quasi! Sit ipsa blanditiis necessitatibus voluptas quas laborum,
            pariatur molestiae quam illo.
          </p>
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
    </div>
  );
};

export default page;
