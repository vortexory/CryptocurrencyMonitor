import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Wallet = ({
  walletName,
  selected = false,
  totalValue,
  onClick,
  color,
}: {
  walletName: string;
  selected?: boolean;
  totalValue: number | string;
  onClick: () => void;
  color: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${
        selected ? "bg-secondary" : "bg-background"
      } flex-container-center gap-3 cursor-pointer hover:bg-secondary p-3 rounded-md`}
    >
      <Avatar>
        <AvatarFallback style={{ backgroundColor: color }}>
          {walletName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{walletName}</p>
        <p className="text-xs">{totalValue}</p>
      </div>
    </div>
  );
};

export default Wallet;
