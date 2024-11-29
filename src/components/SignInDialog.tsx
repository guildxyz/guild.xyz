"use client";

import { signIn } from "@/actions/auth";
import { signInDialogOpenAtom } from "@/config/atoms";
import { env } from "@/lib/env";
import { SignIn, User, Wallet, XCircle } from "@phosphor-icons/react/dist/ssr";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { shortenHex } from "lib/shortenHex";
import { toast } from "sonner";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { z } from "zod";
import { Anchor } from "./ui/Anchor";
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
        <DialogDescription />

        <ResponsiveDialogBody>
          {isConnected ? <SignInWithEthereum /> : <WalletList />}
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

const WalletList = () => {
  const { connectors, connect, isPending, variables } = useConnect();
  const setOpen = useSetAtom(signInDialogOpenAtom);

  return (
    <div className="grid gap-8">
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

      <div className="grid gap-2 text-center text-foreground-secondary text-sm">
        <p>
          <span>{"New to Ethereum wallets? "}</span>
          <Anchor
            href="https://ethereum.org/en/wallets"
            variant="highlighted"
            target="_blank"
            showExternal
          >
            Learn more
          </Anchor>
        </p>

        <p>
          <span>{"By continuing, you agree to our "}</span>
          <Anchor
            href="/privacy-policy"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Anchor>
          <span>{" and "}</span>
          <Anchor
            href="/terms-of-use"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Terms of use
          </Anchor>
        </p>
      </div>
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

      const url = new URL(window.location.href);

      const message = createSiweMessage({
        // biome-ignore lint: address is defined at this point, since we only render this component if `isConnected` is `true`
        address: address!,
        chainId: 1,
        domain: url.hostname,
        nonce,
        uri: url.origin,
        version: "1",
      });

      const signature = await signMessageAsync({ message });

      return signIn({ message, signature });
    },
    onSuccess: () => setSignInDialogOpen(false),
    onError: (error) => {
      toast("Sign in error", {
        description: error.message,
        icon: <XCircle weight="fill" className="text-icon-error" />,
      });
      console.error(error);
    },
  });

  return (
    <div className="grid gap-2">
      <Button
        leftIcon={<User weight="bold" />}
        size="xl"
        className="justify-start"
        disabled
      >
        {/* biome-ignore lint: address is defined at this point, since we only render this component if `isConnected` is `true` */}
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
