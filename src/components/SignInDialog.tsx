"use client";

import { signIn } from "@/actions/auth";
import { signInDialogOpenAtom } from "@/config/atoms";
import { env } from "@/lib/env";
import { SignIn, User, Wallet } from "@phosphor-icons/react/dist/ssr";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { shortenHex } from "lib/shortenHex";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { z } from "zod";
import { Button } from "./ui/Button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "./ui/ResponsiveDialog";

export const SignInDialog = () => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useAtom(signInDialogOpenAtom);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Sign in</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          {isConnected ? <SignInWithEthereum /> : <WalletList />}
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

const WalletList = () => {
  const { connectors, connect, isPending, variables } = useConnect();

  return (
    <div className="grid gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          leftIcon={
            connector.icon ? (
              <img
                src={connector.icon}
                alt={`${connector.name} icon`}
                className="size-6"
              />
            ) : (
              <Wallet weight="bold" className="size-6" />
            )
          }
          size="xl"
          isLoading={
            !!variables?.connector &&
            "id" in variables.connector &&
            variables.connector.id === connector.id &&
            isPending
          }
          loadingText="Check your wallet"
          className="justify-start"
        >
          {connector.name}
        </Button>
      ))}
    </div>
  );
};

const SignInWithEthereum = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const setSignInDialogOpen = useSetAtom(signInDialogOpenAtom);

  const { mutate: signInWithEthereum, isPending } = useMutation({
    mutationKey: ["SIWE"],
    mutationFn: async () => {
      const { nonce } = await fetch(`${env.NEXT_PUBLIC_API}/auth/siwe/nonce`)
        .then((res) => res.json())
        .then((data) => z.object({ nonce: z.string() }).parse(data));
      const urlHostname = `${new URL(env.NEXT_PUBLIC_URL).hostname}:${window.location.port}`;
      const message = createSiweMessage({
        address: address!,
        chainId: 1,
        domain: urlHostname,
        nonce,
        uri: urlHostname,
        version: "1",
      });

      const signature = await signMessageAsync({ message });

      return signIn({ message, signature });
    },
    onSuccess: () => setSignInDialogOpen(false),
  });

  return (
    <div className="grid gap-2">
      <Button
        leftIcon={<User weight="bold" />}
        size="xl"
        className="justify-start"
        disabled
      >
        {shortenHex(address!)}
      </Button>
      <Button
        leftIcon={<SignIn weight="bold" />}
        colorScheme="success"
        size="xl"
        onClick={() => signInWithEthereum()}
        isLoading={isPending}
        loadingText="Check your wallet"
      >
        Sign in with Ethereum
      </Button>
    </div>
  );
};
