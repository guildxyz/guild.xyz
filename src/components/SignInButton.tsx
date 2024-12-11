"use client";

import { signInDialogOpenAtom } from "@/config/atoms";
import { userOptions } from "@/lib/options";
import { Check, SignIn } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import type { ComponentProps } from "react";
import { Button } from "./ui/Button";

export const SignInButton = (props: ComponentProps<typeof Button>) => {
  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);
  const { data: user } = useQuery(userOptions());

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
