"use client";

import Navigation from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  const session = useSession();

  return (
    <>
      {session.status === "authenticated" && <Navigation />}
      {children}
    </>
  );
};

export default PrivateLayout;
