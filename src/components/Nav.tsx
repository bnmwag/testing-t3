import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";

const Nav: FC = () => {
  const { data: sessionData } = useSession();

  const { data } = api.example.getAll.useQuery();

  return (
    <div className="absolute left-0 top-0">
      <div className="flex items-center gap-4">
        {sessionData && (
          <>
            <Avatar>
              <AvatarImage src={sessionData.user?.image || ""} />
              <AvatarFallback>amk</AvatarFallback>
            </Avatar>
            <p className="text-white">{sessionData.user?.name}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
