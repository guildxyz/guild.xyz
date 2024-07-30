"use client"

import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn, toDateTimeString } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"
import {
  initWeb3InboxClient,
  useNotifications,
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useWeb3InboxAccount,
  useWeb3InboxClient,
} from "@web3inbox/react"
import { env } from "env"
import Image from "next/image"
import { useState } from "react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import { useAccount, useSignMessage } from "wagmi"
import { Web3InboxSkeleton } from "./Web3InboxSkeleton"

const WEB3_INBOX_INIT_PARAMS = {
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
} as const

const useInbox = () => {
  initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  const { data } = useWeb3InboxClient()
  const isWeb3ClientReady = !!data

  const { address } = useAccount()
  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )
  const { data: isSubscribed, isLoading: isSubscribedLoading } = useSubscription(
    account ?? undefined,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  const { data: messages, isLoadingNextPage: isMessagesLoading } = useNotifications(
    5,
    false,
    account ?? undefined,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  messages?.sort((msgA, msgB) => msgB.sentAt - msgA.sentAt)

  return {
    isSubscribedLoading,
    isSubscribed,
    messages,
    isMessagesLoading,
    isWeb3ClientReady,
  }
}

const Web3Inbox = () => {
  const {
    isWeb3ClientReady,
    isMessagesLoading,
    messages,
    isSubscribed,
    isSubscribedLoading,
  } = useInbox()

  if (!isSubscribedLoading && !isSubscribed) {
    return (
      <div className="flex items-center gap-4 px-4">
        <Image
          src="/img/message.svg"
          width={24}
          height={24}
          alt="Message icon"
          className="size-6 min-w-6"
        />
        <div className="flex flex-col">
          <h4 className="font-semibold">Subscribe to messages</h4>
          <p className="text-muted-foreground text-sm leading-normal">
            Receive messages from guild admins
          </p>
        </div>
        <span className="grow" />
        <SubscribeToMessages />
      </div>
    )
  }

  if (!isWeb3ClientReady || isMessagesLoading || isSubscribedLoading)
    return <Web3InboxSkeleton />

  if (messages?.length) {
    return messages.map((message) => (
      <Dialog key={message.id}>
        <DialogTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-accent"
            key={message.id}
          >
            <div className="relative mr-4 aspect-square min-w-10 rounded-full">
              <Image src="/requirementLogos/guild.png" alt="Guild castle" fill />
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold">{message.title}</h4>
              <p className="line-clamp-1 text-muted-foreground text-sm leading-normal">
                {message.body}
              </p>
            </div>
            <time className="ml-auto self-start whitespace-nowrap text-muted-foreground text-xs">
              {formatRelativeTimeFromNow(Date.now() - message.sentAt)}
            </time>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image
                src="/requirementLogos/guild.png"
                alt="Guild castle"
                placeholder="blur"
                width={32}
                height={32}
              />
              {message.title}
            </DialogTitle>
          </DialogHeader>

          <DialogBody className="gap-4">
            <p>{message.body}</p>
          </DialogBody>

          <DialogFooter className="flex w-full flex-row items-center justify-between sm:justify-between">
            <time className="text-muted-foreground text-xs">
              {toDateTimeString(message.sentAt)}
            </time>
            {message.url && (
              <Anchor
                variant="unstyled"
                href={message.url}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "gap-2"
                )}
              >
                Go to guild <ArrowRight />
              </Anchor>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ))
  }

  return <p className="my-2 px-4">Your messages will appear here.</p>
}

const useSubscribeToMessages = () => {
  const { onClose, isOpen, setValue: setIsOpen } = useDisclosure()
  const { address } = useAccount()
  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )
  const [isSigning, setIsSigning] = useState(false)
  const { prepareRegistration } = usePrepareRegistration()
  const { register, isLoading: isRegistering } = useRegister()
  const { subscribe, isLoading: isSubscribing } = useSubscribe(
    account ?? undefined,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  const { signMessageAsync } = useSignMessage()
  const { toast } = useToast()
  const performSubscribe = async () => {
    if (!address) return

    try {
      const { message, registerParams } = await prepareRegistration()
      setIsSigning(true)
      const signature = await signMessageAsync({
        account: address,
        message: message,
      }).finally(() => setIsSigning(false))
      await register({ registerParams, signature })
    } catch (web3InboxRegisterError) {
      console.error("web3InboxRegisterError", web3InboxRegisterError)
      toast({ title: "Web3Inbox registration error", variant: "error" })
      return
    }

    try {
      await subscribe()
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via Web3Inbox",
      })
      onClose()
    } catch (web3InboxSubscribeError) {
      console.error("web3InboxSubscribeError", web3InboxSubscribeError)
      toast({ title: "Couldn't subscribe to Guild messages", variant: "error" })
    }
  }

  return {
    isOpen,
    setIsOpen,
    isSigning,
    performSubscribe,
    isRegistering,
    isSubscribing,
  }
}

const SubscribeToMessages = () => {
  const {
    isOpen,
    setIsOpen,
    isSigning,
    performSubscribe,
    isRegistering,
    isSubscribing,
  } = useSubscribeToMessages()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="size-8 min-w-8 px-0" colorScheme="info">
          <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to messages</DialogTitle>
        </DialogHeader>

        <DialogBody className="gap-8">
          <p>
            Guild admins can send broadcast messages to your wallet through{" "}
            <Anchor href="https://web3inbox.com" variant="highlighted" showExternal>
              Web3Inbox
            </Anchor>
            . Sign a message to start receiving them!
          </p>
          <Button
            onClick={performSubscribe}
            isLoading={isSigning || isRegistering || isSubscribing}
            loadingText={isSigning ? "Check your wallet" : "Subscribing"}
            colorScheme="info"
            className="w-full"
          >
            Sign to subscribe
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export default Web3Inbox
