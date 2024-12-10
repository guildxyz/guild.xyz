"use client";

// Temp component for testing the connect Discord flow. Should be deleted before merging the PR!

import { env } from "@/lib/env";
import { Anchor } from "./ui/Anchor";

export const ConnectDiscord = () => {
  if (typeof window === "undefined") return null;

  return (
    <Anchor
      href={`${env.NEXT_PUBLIC_API}/connect/DISCORD?returnTo=${window.location.href}`}
    >
      Connect Discord
    </Anchor>
  );
};
