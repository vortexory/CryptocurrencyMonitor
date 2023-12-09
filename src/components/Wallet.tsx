import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Wallet = ({
  walletName,
  selected = false,
}: {
  walletName: string;
  selected?: boolean;
}) => {
  return (
    <div
      className={`${
        selected ? "bg-muted-foreground" : "bg-background"
      } flex-container-center gap-3 cursor-pointer hover:bg-muted-foreground p-3 rounded-md`}
    >
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>{walletName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{walletName}</p>
        <p className="text-xs">$1,500$</p>
      </div>
    </div>
  );
};

export default Wallet;
