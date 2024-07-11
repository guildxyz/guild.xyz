"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
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
import Link from "next/link"
import { useState } from "react"
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
        <Link href="/profile/activity">
          <Button className="w-full gap-2" variant="ghost" size="md">
            View activity
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Inbox = () => {
  // CONTAINER -------------

  initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  const { data } = useWeb3InboxClient()
  const isReady = !!data

  const { address } = useAccount()
  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )
  const { data: subscription } = useSubscription(
    account ?? undefined,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  const { data: messages } = useNotifications(
    5,
    false,
    account ?? undefined,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  messages?.sort((msgA, msgB) => msgB.sentAt - msgA.sentAt)

  // VIEW -------------

  if (!isReady) {
    return (
      <>
        <WebInboxSkeleton />
        <WebInboxSkeleton />
      </>
    )
  }
  if (!subscription) {
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
  if (messages && messages.length) {
    return messages.map((message) => (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-accent"
            key={message.id}
          >
            <div className="relative aspect-square min-w-10 rounded-full">
              <Image
                src={guildNotificationImage}
                alt="Guild castle"
                placeholder="blur"
                fill
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold">{message.title}</h4>
              <p className="line-clamp-1 text-muted-foreground text-sm leading-normal">
                {message.body}
              </p>
            </div>
            <time className="ml-auto self-start text-muted-foreground text-xs">
              {formatDate(message.sentAt)}
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
              {formatDate(message.sentAt)}
            </time>
            {message.url && (
              <Anchor
                href={message.url}
                className="flex items-center gap-1"
                variant="highlighted"
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

const WebInboxSkeleton = () => (
  <div className="grid h-10 grid-cols-[auto_1fr] grid-rows-2 gap-2 space-x-2 px-4">
    <Skeleton className="row-span-2 aspect-square h-full rounded-full" />
    <Skeleton />
    <Skeleton className="w-10/12" />
  </div>
)

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const SubscribeToMessages = () => {
  const { onClose, isOpen, setValue } = useDisclosure()
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

  return (
    <Dialog open={isOpen} onOpenChange={setValue}>
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

// import {
//   HStack,
//   Img,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Stack,
//   Text,
//   useBreakpointValue,
//   useColorModeValue,
//   useDisclosure,
// } from "@chakra-ui/react"
// import { ArrowRight } from "@phosphor-icons/react"
// import Button from "components/common/Button"
// import { Modal } from "components/common/Modal"
// import Link from "next/link"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

// const GUILD_NOTIFICATION_ICON = "/requirementLogos/guild.png" as const

const Web3InboxMessage = ({
  sentAt,
  title,
  body,
  url,
}: {
  sentAt: number
  title: string
  body: string
  url: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const hoverBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.200")
  // const isMobile = useBreakpointValue({ base: true, sm: false })

  const prettyDate = new Date(sentAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // return (
  //   <>
  //     <HStack
  //       as="button"
  //       spacing={4}
  //       textAlign="left"
  //       px={4}
  //       pl={5}
  //       py={3}
  //       _focusVisible={{
  //         outline: "none",
  //         bgColor: hoverBgColor,
  //       }}
  //       _hover={{
  //         bgColor: hoverBgColor,
  //       }}
  //       transition="background 0.2s ease"
  //       onClick={onOpen}
  //     >
  //       <Img
  //         src={GUILD_NOTIFICATION_ICON}
  //         alt={title}
  //         boxSize={10}
  //         borderRadius="full"
  //       />
  //
  //       <Stack spacing={0} w="full">
  //         <HStack justifyContent="space-between">
  //           <Text as="span" fontWeight="bold" noOfLines={1}>
  //             {title}
  //           </Text>
  //           <Text as="span" colorScheme="gray" fontSize="xs" minW="max-content">
  //             {formatRelativeTimeFromNow(Date.now() - sentAt)}
  //           </Text>
  //         </HStack>
  //         <Text noOfLines={1} colorScheme="gray">
  //           {body}
  //         </Text>
  //       </Stack>
  //     </HStack>
  //
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalContent>
  //         <ModalHeader pb="6">
  //           <HStack spacing={3}>
  //             <Img
  //               src={GUILD_NOTIFICATION_ICON}
  //               alt={title}
  //               boxSize={8}
  //               borderRadius="full"
  //             />
  //             <Text mt="-1">{title}</Text>
  //           </HStack>
  //         </ModalHeader>
  //         <ModalCloseButton />
  //
  //         <ModalBody>
  //           <Stack spacing={4}>
  //             <Text>{body}</Text>
  //           </Stack>
  //         </ModalBody>
  //         <ModalFooter pt="0" pb="8">
  //           <Text fontFamily="body" colorScheme="gray" fontSize="sm">
  //             {prettyDate}
  //           </Text>
  //           <Button
  //             as={Link}
  //             href={url}
  //             variant="ghost"
  //             colorScheme="primary"
  //             size="sm"
  //             ml="auto"
  //             rightIcon={<ArrowRight />}
  //           >
  //             Go to guild
  //           </Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     </Modal>
  //   </>
  // )
}

// import {
//   Box,
//   Center,
//   Collapse,
//   HStack,
//   Icon,
//   IconButton,
//   Img,
//   Link,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalHeader,
//   ModalOverlay,
//   Stack,
//   Text,
//   useDisclosure,
// } from "@chakra-ui/react"
// import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react"
// import {
//   initWeb3InboxClient,
//   useNotifications,
//   usePrepareRegistration,
//   useRegister,
//   useSubscribe,
//   useSubscription,
//   useWeb3InboxAccount,
//   useWeb3InboxClient,
// } from "@web3inbox/react"
// import Button from "components/common/Button"
// import { Modal } from "components/common/Modal"
// import { env } from "env"
// import useShowErrorToast from "hooks/useShowErrorToast"
// import useToast from "hooks/useToast"
// import dynamic from "next/dynamic"
// import { useRef, useState } from "react"
// import { useAccount, useSignMessage } from "wagmi"
// import WebInboxSkeleton from "./WebInboxSkeleton"
//
// const DynamicWeb3InboxMessage = dynamic(() => import("./Web3InboxMessage"))
//
// const WEB3_INBOX_INIT_PARAMS = {
//   projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
//   domain: "guild.xyz",
//   allApps: process.env.NODE_ENV !== "production",
// }
//
// const Web3Inbox = () => {
//   initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
//   const { data } = useWeb3InboxClient()
//   const isReady = !!data
//
//   const { address } = useAccount()
//   const { data: account } = useWeb3InboxAccount(
//     address ? `eip155:1:${address}` : undefined
//   )
//
//   const { data: subscription } = useSubscription(
//     account,
//     WEB3_INBOX_INIT_PARAMS.domain
//   )
//
//   const { data: messages } = useNotifications(
//     5,
//     false,
//     account,
//     WEB3_INBOX_INIT_PARAMS.domain
//   )
//
//   const inboxContainerRef = useRef(null)
//   const isScrollable = !!inboxContainerRef.current
//     ? inboxContainerRef.current.scrollHeight > inboxContainerRef.current.clientHeight
//     : false
//
//   if (!isReady) return <WebInboxSkeleton />
//
//   return (
//     <Stack spacing={0}>
//       <Collapse in={!subscription}>
//         <HStack pt={4} pb={5} pl={1} spacing={4}>
//           <Center boxSize="6" flexShrink={0}>
//             <Img src="/img/message.svg" boxSize={5} alt="Messages" mt={0.5} />
//           </Center>
//           <Stack spacing={0.5} w="full">
//             <Text as="span" fontWeight="semibold">
//               Subscribe to messages
//             </Text>
//             <Text as="span" fontSize="sm" colorScheme="gray" lineHeight={1.25}>
//               Receive messages from guild admins
//             </Text>
//           </Stack>
//
//           <SubscribeToMessages />
//         </HStack>
//       </Collapse>
//
//       <Collapse
//         in={!!subscription}
//         style={{ marginInline: "calc(-1 * var(--chakra-space-4))" }}
//       >
//         <Box
//           ref={inboxContainerRef}
//           maxH="30vh"
//           overflowY="auto"
//           className="custom-scrollbar"
//           pb="4"
//           sx={{
//             WebkitMaskImage:
//               isScrollable &&
//               "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%), linear-gradient(to left, black 0%, black 8px, transparent 8px, transparent 100%)",
//           }}
//         >
//           {messages?.length > 0 ? (
//             <Stack pt={2} spacing={0}>
//               {messages
//                 .sort((msgA, msgB) => msgB.sentAt - msgA.sentAt)
//                 .map(({ sentAt, id, title, body, url }) => (
//                   <DynamicWeb3InboxMessage
//                     key={id}
//                     sentAt={sentAt}
//                     title={title}
//                     body={body}
//                     url={url}
//                   />
//                 ))}
//             </Stack>
//           ) : (
//             <HStack pt={3} px={4}>
//               <Text colorScheme="gray">
//                 Your messages from guilds will appear here
//               </Text>
//             </HStack>
//           )}
//         </Box>
//       </Collapse>
//     </Stack>
//   )
// }
//
// const SubscribeToMessages = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const { address } = useAccount()
//
//   const { data: account } = useWeb3InboxAccount(
//     address ? `eip155:1:${address}` : undefined
//   )
//
//   const [isSigning, setIsSigning] = useState(false)
//
//   const { prepareRegistration } = usePrepareRegistration()
//   const { register, isLoading: isRegistering } = useRegister()
//   const { subscribe, isLoading: isSubscribing } = useSubscribe(
//     account,
//     WEB3_INBOX_INIT_PARAMS.domain
//   )
//
//   const { signMessageAsync } = useSignMessage()
//
//   const showErrorToast = useShowErrorToast()
//   const toast = useToast()
//
//   const performSubscribe = async () => {
//     if (!address) return
//
//     try {
//       const { message, registerParams } = await prepareRegistration()
//       setIsSigning(true)
//       const signature = await signMessageAsync({
//         account: address,
//         message: message,
//       }).finally(() => setIsSigning(false))
//       await register({ registerParams, signature })
//     } catch (web3InboxRegisterError) {
//       console.error("web3InboxRegisterError", web3InboxRegisterError)
//       showErrorToast("Web3Inbox registration error")
//       return
//     }
//
//     try {
//       await subscribe()
//       toast({
//         status: "success",
//         title: "Success",
//         description: "Successfully subscribed to Guild messages via Web3Inbox",
//       })
//       onClose()
//     } catch (web3InboxSubscribeError) {
//       console.error("web3InboxSubscribeError", web3InboxSubscribeError)
//       showErrorToast("Couldn't subscribe to Guild messages")
//     }
//   }
//
//   return (
//     <>
//       <IconButton
//         variant="solid"
//         colorScheme="blue"
//         size="sm"
//         onClick={onOpen}
//         isLoading={isSubscribing}
//         icon={<ArrowRight />}
//         aria-label="Open subscribe modal"
//       />
//       <Modal {...{ isOpen, onClose }}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader pb="4">Subscribe to messages</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Text mb="8">
//               Guild admins can send broadcast messages to your wallet through{" "}
//               <Link href="https://web3inbox.com" colorScheme="blue" isExternal>
//                 Web3Inbox
//                 <Icon as={ArrowSquareOut} ml={1} />
//               </Link>
//               . Sign a message to start receiving them!
//             </Text>
//             <Button
//               variant="solid"
//               colorScheme="blue"
//               onClick={performSubscribe}
//               isLoading={isSigning || isRegistering || isSubscribing}
//               loadingText={isSigning ? "Check your wallet" : "Subscribing"}
//               w="full"
//             >
//               Sign to subscribe
//             </Button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </>
//   )
// }
//
// export default Web3Inbox

// import { usePostHogContext } from "@/components/Providers/PostHogProvider"
// import { Button } from "@/components/ui/Button"
// import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
// import {
//   Divider,
//   Icon,
//   Popover,
//   PopoverArrow,
//   PopoverBody,
//   PopoverCloseButton,
//   PopoverContent,
//   PopoverTrigger,
//   Stack,
// } from "@chakra-ui/react"
// import { Bell } from "@phosphor-icons/react"
// import { ActivityLogProvider } from "components/[guild]/activity/ActivityLogContext"
// import useUser from "components/[guild]/hooks/useUser"
// import useLocalStorage from "hooks/useLocalStorage"
// import dynamic from "next/dynamic"
// import WebInboxSkeleton from "../Web3Inbox/WebInboxSkeleton"
// import NotificationsActivityLog from "./components/NotificationsActivityLog"
// import NotificationsSection from "./components/NotificationsSection"
//
// const DynamicWeb3Inbox = dynamic(() => import("../Web3Inbox"), {
//   ssr: false,
//   loading: WebInboxSkeleton,
// })
// const VIEWPORT_GAP_PX = 8
//
// const Notifications = () => {
//   const { id } = useUser()
//   const { captureEvent } = usePostHogContext()
//
//   const [clickedOnNotifications, setClickedOnNotifications] = useLocalStorage(
//     "clicked-web3inbox-feature-notification",
//     false
//   )
//
//   const { type } = useWeb3ConnectionManager()
//
//   return (
//     <Popover
//       placement="bottom"
//       isLazy
//       strategy="absolute"
//       closeOnBlur={false}
//       modifiers={[
//         { name: "preventOverflow", options: { padding: VIEWPORT_GAP_PX } },
//       ]}
//     >
//       {({ isOpen }) => (
//         <>
//           <PopoverTrigger>
//             <Button
//               aria-label="Notifications"
//               onClick={() => {
//                 setClickedOnNotifications(true)
//                 if (isOpen) return
//                 captureEvent("opened UserActivityLogPopover")
//               }}
//               // sx={{
//               //   "@keyframes notification": {
//               //     "0%": { transform: "rotate(0deg)" },
//               //     "2.5%": { transform: "rotate(15deg)" },
//               //     "5%": { transform: "rotate(-15deg)" },
//               //     "7.5": { transform: "rotate(15deg)" },
//               //     "10%": { transform: "rotate(0deg)" },
//               //   },
//               // }}
//             >
//               <Icon
//                 as={Bell}
//                 transformOrigin="top center"
//                 animation={
//                   clickedOnNotifications || type !== "EVM"
//                     ? undefined
//                     : "notification 4s ease-in-out infinite"
//                 }
//               />
//             </Button>
//           </PopoverTrigger>
//
//           <PopoverContent
//             minW="none"
//             maxW={`calc(100vw - ${2 * VIEWPORT_GAP_PX}px)`}
//             w="400px"
//           >
//             <PopoverArrow />
//             <PopoverCloseButton />
//
//             <PopoverBody py={3} px={0}>
//               <Stack spacing={0}>
//                 {type === "EVM" && (
//                   <NotificationsSection title="Messages">
//                     <DynamicWeb3Inbox />
//                   </NotificationsSection>
//                 )}
//
//                 <Divider mb="4" />
//
//                 <ActivityLogProvider
//                   userId={id}
//                   withSearchParams={false}
//                   isInfinite={false}
//                   limit={3}
//                 >
//                   <NotificationsSection title="Recent activity">
//                     <NotificationsActivityLog />
//                   </NotificationsSection>
//                 </ActivityLogProvider>
//               </Stack>
//             </PopoverBody>
//           </PopoverContent>
//         </>
//       )}
//     </Popover>
//   )
// }
//
// export default Notifications
