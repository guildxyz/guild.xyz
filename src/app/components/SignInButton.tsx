"use client";

import { SignIn } from "@phosphor-icons/react/dist/ssr";
import { signInDialogOpenAtom } from "app/config/atoms";
import { useSetAtom } from "jotai";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export const SignInButton = () => {
  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);

  return (
    <Card className="rounded-xl">
      <Button
        className="h-10"
        leftIcon={<SignIn weight="bold" />}
        onClick={() => setSignInDialogOpen(true)}
      >
        Sign in
      </Button>
    </Card>
  );
};
