"use client";

import { signIn, getProviders } from "next-auth/react";
import { type FC, useEffect, useState } from "react";

interface Provider {
  id: string;
  name: string;
}

const SignInPage: FC = () => {
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
      <div className="rounded-xl bg-background px-12 py-6 shadow-2xl">
        <h1 className="text-3xl">Sign up</h1>
        <div className="mt-12 flex flex-row gap-2">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() => void signIn(provider.id)}
                className="rounded-full bg-foreground px-10 py-3 font-semibold text-white no-underline transition hover:bg-foreground/80"
              >
                Sign in with {provider.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
