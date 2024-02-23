"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./ui/toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  signIn,
  signOut,
  useSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio Tracker", href: "/portfolio-tracker" },
  { name: "Watchlist", href: "/watchlist" },
];

const Navigation = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  const handleAuthentication = () => {
    session?.user ? signOut() : providers && signIn();
  };

  const pathname = usePathname();

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <div className="wrapper flex-container-center justify-between">
      <div className="w-full flex-container-center justify-end sm:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="top" className="py-12">
            <div className="flex flex-col gap-2 items-center">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`border-b ${
                      pathname === link.href
                        ? "border-foreground"
                        : "border-transparent"
                    } hover:border-foreground transition-all duration-300`}
                  >
                    <SheetClose>{link.name}</SheetClose>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex-container-center justify-center gap-4 w-full">
              <ModeToggle />
              <Button onClick={handleAuthentication} className="w-fit">
                {session?.user ? "Sign Out" : "Sign In"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden sm:flex-container-center gap-6">
        {navLinks.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`border-b ${
                pathname === link.href
                  ? "border-foreground"
                  : "border-transparent"
              } hover:border-foreground transition-all duration-300`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="hidden sm:flex-container-center gap-4">
        <ModeToggle />

        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                />
                <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleAuthentication}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleAuthentication}>Sign In</Button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
