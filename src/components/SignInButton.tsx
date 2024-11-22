"use client";

import { signInDialogOpenAtom } from "@/config/atoms";
import { SignIn } from "@phosphor-icons/react/dist/ssr";
import { useSetAtom } from "jotai";
import type { ComponentProps } from "react";
import { Button } from "./ui/Button";

export const SignInButton = (props: ComponentProps<typeof Button>) => {
  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);

  return (
    <Button
      {...props}
      leftIcon={<SignIn weight="bold" />}
      onClick={() => setSignInDialogOpen(true)}
    >
      Sign in
    </Button>
  );
};
