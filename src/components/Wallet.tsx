import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Wallet = ({
  walletName,
  selected = false,
  totalValue,
}: {
  walletName: string;
  selected?: boolean;
  totalValue: number;
}) => {
  return (
    <div
      className={`${
        selected ? "bg-muted-foreground" : "bg-background"
      } flex-container-center gap-3 cursor-pointer hover:bg-muted-foreground p-3 rounded-md`}
    >
      <Avatar>
        <AvatarFallback>{walletName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{walletName}</p>
        <p className="text-xs">${totalValue}</p>
      </div>
    </div>
  );
};

export default Wallet;
