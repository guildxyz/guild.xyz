"use client"

import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn, toDateTimeString } from "@/lib/utils"
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
import { PiArrowRight } from "react-icons/pi"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import { useAccount, useSignMessage } from "wagmi"
import MessageImage from "/public/img/message.svg"
import guildNotificationImage from "/public/requirementLogos/guild.png"
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

  if (!isWeb3ClientReady || isMessagesLoading || isSubscribedLoading)
    return <Web3InboxSkeleton />

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
                Go to guild <PiArrowRight />
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
          <PiArrowRight />
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

export default Web3Inbox
