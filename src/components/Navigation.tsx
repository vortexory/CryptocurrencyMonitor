import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ui/toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  return (
    <div className="wrapper flex-container-center justify-between">
      <div className="flex-container-center gap-4">
        <Link
          href="/"
          className="border-b border-transparent hover:border-foreground"
        >
          Home
        </Link>
        <Link
          href="/my-wallet"
          className="border-b border-transparent hover:border-foreground"
        >
          My Wallet
        </Link>
      </div>
      <div className="flex-container-center gap-4">
        <ModeToggle />
        <Avatar>
          <AvatarImage
            src="https://github.com/ionandrei44.png"
            alt="@ionandrei44"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navigation;
