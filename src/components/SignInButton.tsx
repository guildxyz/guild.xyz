"use client";

import { signInDialogOpenAtom } from "@/config/atoms";
import { cn } from "@/lib/cssUtils";
import { SignIn } from "@phosphor-icons/react/dist/ssr";
import { useSetAtom } from "jotai";
import type { ComponentProps } from "react";
import { Button } from "./ui/Button";

export const SignInButton = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);

  return (
    <Button
      className={cn("h-10", className)}
      variant="solid"
      colorScheme="primary"
      {...props}
      leftIcon={<SignIn weight="bold" />}
      onClick={() => setSignInDialogOpen(true)}
    >
      Sign in
    </Button>
  );
};
