"use client";

import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import { signIn, getProviders } from "next-auth/react";
import Image from "next/image";
import { type FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Provider {
  id: string;
  name: string;
}

const SignInPage: NextPage = () => {
  const [providers, setProviders] = useState<{
    [key: string]: Provider;
  } | null>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    void setUpProviders();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardDescription>Sign Up with:</CardDescription>
          {/* <CardTitle>
            {" "}
            <h1 className="text-md tracking-tight text-foreground sm:text-[3rem]">
              <span className="text-highlight">hub</span>.bnmwag.dev
            </h1>
          </CardTitle> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {/* <span className="text-center text-foreground opacity-50">
              sign up with
            </span> */}
            {providers &&
              Object.values(providers).map((provider) => (
                <ProviderButton key={provider.name} provider={provider} />
              ))}
          </div>
        </CardContent>
        {/* <CardFooter><p>Card Footer</p></CardFooter> */}
      </Card>
    </div>
  );
};

export default SignInPage;

export interface ProviderButtonProps {
  provider: Provider;
}

export const ProviderButton: FC<ProviderButtonProps> = ({ provider }) => {
  const props = getProps(provider.name) || {
    bgColor: "#ffffff",
    textColor: "#000000",
    iconSrc: "/dc-icon.png",
  };

  function getProps(providerName: string) {
    switch (providerName) {
      case "Discord":
        return {
          bgColor: "#6c89e0",
          textColor: "#ffffff",
          iconSrc: "/dc-icon.png",
        };
      case "Google":
        return {
          bgColor: "#ffffff",
          textColor: "#000000",
          iconSrc: "/go-icon.png",
        };
      case "GitHub":
        return {
          bgColor: "#000000",
          textColor: "#ffffff",
          iconSrc: "/gh-icon.png",
        };
    }
  }

  return (
    <Button
      onClick={() => void signIn(provider.id)}
      className="gap-2 text-white"
      style={{ backgroundColor: props.bgColor, color: props.textColor }}
    >
      <Image
        src={`${props.iconSrc}`}
        width={20}
        height={20}
        alt={`${provider.name} logo icon`}
      />
      <span>Log in with {provider.name}</span>
    </Button>
  );
};
