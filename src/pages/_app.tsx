import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Nav from "@/components/Nav";
import { TooltipProvider } from "@/components/ui/tooltip";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TooltipProvider>
        <div className="fixed bottom-0 left-0 right-0 top-0 -z-10 bg-background" />

        <header className="border-b">
          <div className="container">
            <Nav />
          </div>
        </header>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="container">
            <Component {...pageProps} />
          </div>
        </motion.main>
      </TooltipProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
