import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";

// import { api } from "@/utils/api";
import { Combobox } from "./Combobox";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { Button } from "./ui/button";

const Nav: FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="py-2">
      <div className="flex items-center gap-4">
        {sessionData && (
          <>
            <Avatar>
              <AvatarImage src={sessionData.user?.image || ""} />
              <AvatarFallback>
                {sessionData.user?.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Combobox defaultValue={sessionData.user?.name || undefined} />
            <Separator className="ml-12 mr-8 h-8 w-[1px] rounded-full bg-foreground/10" />
            <div className="flex flex-row gap-2">
              <Button variant="ghost">
                <Link href="/personal">
                  <span className="text-sm text-foreground">Overview</span>
                </Link>
              </Button>
              <Button variant="ghost">
                <Link href="/personal/projects">
                  <span className="text-sm text-foreground">Projects</span>
                </Link>
              </Button>
            </div>
          </>
        )}
        {!sessionData && (
          <Button>
            <Link href="/login">
              <span>Sign up</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
