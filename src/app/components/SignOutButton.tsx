"use client";

import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "app/actions/auth";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";

export const SignOutButton = () => {
  const pathname = usePathname();
  return (
    <Button
      className="h-10"
      leftIcon={<SignOut weight="bold" />}
      onClick={() => signOut(pathname)}
    >
      Sign out
    </Button>
  );
};
