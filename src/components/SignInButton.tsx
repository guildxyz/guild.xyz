"use client";

import { signInDialogOpenAtom } from "@/config/atoms";
import { useUser } from "@/hooks/useUser";
import { Check, SignIn } from "@phosphor-icons/react/dist/ssr";
import { useSetAtom } from "jotai";
import type { ComponentProps } from "react";
import { Button } from "./ui/Button";

export const SignInButton = (props: ComponentProps<typeof Button>) => {
  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);
  const { data: user } = useUser();

  return (
    <Button
      {...props}
      leftIcon={user ? <Check weight="bold" /> : <SignIn weight="bold" />}
      disabled={!!user}
      onClick={() => setSignInDialogOpen(true)}
    >
      Sign in
    </Button>
  );
};
