"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import Image from "next/image";

const SignIn = () => {
  const { data: session, status } = useSession();
  const [loadingProviders, setLoadingProviders] = useState<boolean>(false);

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      setLoadingProviders(true);
      const response = await getProviders();

      setProviders(response);
      setLoadingProviders(false);
    };

    setUpProviders();
  }, []);

  if (session) {
    return redirect("/");
  }

  if (loadingProviders || status === "loading") {
    return (
      <div className="wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="wrapper flex justify-center items-center min-h-screen">
      <Card className="min-w-[380px] max-w-full">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to Crypto Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Please choose a way to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Object.values(providers ?? {}).map((provider) => {
            return (
              <Button
                variant="secondary"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="mx-auto flex-container-center gap-2 w-full"
              >
                <Image
                  src={provider.id === "google" ? "/google.svg" : "/github.svg"}
                  width={25}
                  height={25}
                  alt={provider.id === "google" ? "google-icon" : "github-icon"}
                />
                Sign in with {provider.name}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
