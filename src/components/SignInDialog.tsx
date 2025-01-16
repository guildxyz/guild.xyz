"use client";

import { signInDialogOpenAtom } from "@/config/atoms";
import { fetchGuildApi } from "@/lib/fetchGuildApi";
import { authSchema } from "@/lib/schemas/user";
import {
  SignIn,
  SignOut,
  User,
  Wallet,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { shortenHex } from "lib/shortenHex";
import { toast } from "sonner";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { z } from "zod";
import { Anchor, anchorVariants } from "./ui/Anchor";
import { Button } from "./ui/Button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "./ui/ResponsiveDialog";
const CUSTOM_CONNECTOR_ICONS = {
  "com.brave.wallet": "/walletLogos/brave.svg",
  walletConnect: "/walletLogos/walletconnect.svg",
  coinbaseWalletSDK: "/walletLogos/coinbasewallet.png",
} as const;

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
        {connectors.map((connector) => {
          const connetorIcon =
            CUSTOM_CONNECTOR_ICONS[
              connector.id as keyof typeof CUSTOM_CONNECTOR_ICONS
            ] ?? connector.icon;
          return (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              leftIcon={
                connetorIcon ? (
                  <img
                    src={connetorIcon}
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
          );
        })}
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

  const queryClient = useQueryClient();

  const { mutate: signInWithEthereum, isPending } = useMutation({
    mutationKey: ["SIWE"],
    mutationFn: async () => {
      const nonceResponse = await fetchGuildApi("auth/siwe/nonce");
      const { nonce } = z
        .object({ nonce: z.string() })
        .parse(nonceResponse.data);

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

      const requestInit = {
        method: "POST",
        body: JSON.stringify({
          message,
          signature,
        }),
      } satisfies RequestInit;

      const signInRes = await fetchGuildApi("auth/siwe/login", requestInit);
      let json = signInRes.data;
      if (signInRes.response.status === 401) {
        const registerRes = await fetchGuildApi(
          "auth/siwe/register",
          requestInit,
        );
        json = registerRes.data;
      }
      const authData = authSchema.parse(json);

      return authData;
    },
    onSuccess: () => {
      setSignInDialogOpen(false);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast("Sign in error", {
        description: error.message,
        icon: <XCircle weight="fill" className="text-icon-error" />,
      });
      console.error(error);
    },
  });

  const { disconnect } = useDisconnect();

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
      <Button
        leftIcon={<SignOut weight="bold" />}
        size="sm"
        variant="unstyled"
        className={anchorVariants({
          variant: "secondary",
          className: "mx-auto max-w-max px-0",
        })}
        onClick={() => disconnect()}
      >
        Disconnect wallet
      </Button>
    </div>
  );
};
