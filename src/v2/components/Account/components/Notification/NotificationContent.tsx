"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
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
import MessageImage from "/public/img/message.svg"
import guildNotificationImage from "/public/requirementLogos/guild.png"

const WEB3_INBOX_INIT_PARAMS = {
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
} as const

export const NotificationContent = () => {
  const { type } = useWeb3ConnectionManager()

  return (
    <div>
      {type === "EVM" && (
        <>
          <section>
            <h3 className="mx-4 mb-4 font-bold text-muted-foreground text-xs">
              MESSAGES
            </h3>
            <div className="flex flex-col gap-4">
              <Inbox />
            </div>
          </section>
          <Separator className="my-4" />
        </>
      )}
      <div className="px-4">
        <Anchor
          variant="silent"
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "w-full gap-2"
          )}
          href="/profile/activity"
        >
          View recent activity
          <ArrowRight />
        </Anchor>
      </div>
    </div>
  )
}

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

const Inbox = () => {
  const {
    isWeb3ClientReady,
    isMessagesLoading,
    messages,
    isSubscribed,
    isSubscribedLoading,
  } = useInbox()

  if (!isWeb3ClientReady || isMessagesLoading || isSubscribedLoading)
    return (
      <div className="my-2 grid h-10 grid-cols-[auto_1fr] grid-rows-2 gap-2 space-x-2 px-4">
        <Skeleton className="row-span-2 aspect-square h-full rounded-full" />
        <Skeleton />
        <Skeleton className="w-10/12" />
      </div>
    )

  if (!isSubscribed) {
    return (
      <div className="flex items-center gap-4 px-4">
        <MessageImage className="size-6 min-w-6" />
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

  if (messages?.length) {
    return messages.map((message) => (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-accent"
            key={message.id}
          >
            <div className="relative mr-4 aspect-square min-w-10 rounded-full">
              <Image src={guildNotificationImage} alt="Guild castle" fill />
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
          <DialogTitle className="mb-6 flex items-center gap-2">
            <Image
              src={guildNotificationImage}
              alt="Guild castle"
              placeholder="blur"
              width={32}
              height={32}
            />
            {message.title}
          </DialogTitle>
          <DialogDescription className="text-card-foreground">
            {message.body}
          </DialogDescription>
          <div className="mt-6 flex items-center justify-between">
            <time className="text-muted-foreground text-xs">
              {toDateTimeString(message.sentAt)}
            </time>
            {message.url && (
              <Anchor
                variant="silent"
                href={message.url}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2"
                )}
              >
                Go to guild <ArrowRight />
              </Anchor>
            )}
          </div>
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
        <Button className="size-8 min-w-8 px-0">
          <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Subscribe to messages</DialogTitle>
        <DialogDescription className="my-8 text-card-foreground">
          Guild admins can send broadcast messages to your wallet through{" "}
          <Anchor href="https://web3inbox.com" variant="highlighted" showExternal>
            Web3Inbox
          </Anchor>
          . Sign a message to start receiving them!
        </DialogDescription>
        <Button
          onClick={performSubscribe}
          isLoading={isSigning || isRegistering || isSubscribing}
          loadingText={isSigning ? "Check your wallet" : "Subscribing"}
          className="w-full"
        >
          Sign to subscribe
        </Button>
      </DialogContent>
    </Dialog>
  )
}
