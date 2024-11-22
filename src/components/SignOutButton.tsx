"use client";

import { signOut } from "@/actions/auth";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";

export const SignOutButton = () => {
  const pathname = usePathname();
  return (
    <Button
      variant="ghost"
      leftIcon={<SignOut weight="bold" />}
      onClick={() => signOut(pathname)}
    >
      Sign out
    </Button>
  );
};
