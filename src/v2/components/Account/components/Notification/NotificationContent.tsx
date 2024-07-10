"use client"

import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"

export const NotificationContent = () => {
  const { type } = useWeb3ConnectionManager()

  return (
    <div>
      {type === "EVM" && (
        <section>
          <h3 className="text-xs font-bold text-muted-foreground">MESSAGES</h3>
          <div className="flex flex-col gap-2">
            <WebInboxSkeleton />
            <div>card</div>
          </div>
        </section>
      )}
      <Separator className="my-4" />
      <Link href="/profile/activity">
        <Button className="w-full gap-2" variant="ghost">
          View activity
          <ArrowRight />
        </Button>
      </Link>
    </div>
  )
}

const WebInboxSkeleton = () => (
  <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-2 h-16">
    <Skeleton className="row-span-2 rounded-full aspect-square h-full" />
    <Skeleton className="" />
    <Skeleton className="" />
  </div>
)

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
