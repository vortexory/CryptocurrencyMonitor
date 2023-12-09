import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

const ActionsCell = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="cursor-pointer hover:bg-muted-foreground">
          Transactions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="cursor-pointer hover:bg-muted-foreground">
          Remove
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
