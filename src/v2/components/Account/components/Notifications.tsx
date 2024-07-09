import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useLocalStorage from "hooks/useLocalStorage"
// import dynamic from "next/dynamic"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Web3Inbox } from "./Web3Inbox"

// const DynamicWeb3Inbox = dynamic(() => import("./Web3Inbox"), {
//   ssr: false,
//   loading: null,
// })

// const VIEWPORT_GAP_PX = 8

export const Notifications = () => {
  const { id } = useUser()
  const { captureEvent } = usePostHogContext()
  const [clickedOnNotifications, setClickedOnNotifications] = useLocalStorage(
    "clicked-web3inbox-feature-notification",
    false
  )
  const { type } = useWeb3ConnectionManager()
  if (type === "EVM") {
    return <Web3Inbox />
  }
  return "notification"
  // {type === "EVM" && (
  //   <NotificationsSection title="Messages">
  //     <DynamicWeb3Inbox />
  //   </NotificationsSection>
  // )}

  // return (
  //   <Popover
  //     placement="bottom"
  //     isLazy
  //     strategy="absolute"
  //     closeOnBlur={false}
  //     modifiers={[
  //       { name: "preventOverflow", options: { padding: VIEWPORT_GAP_PX } },
  //     ]}
  //   >
  //     {({ isOpen }) => (
  //       <>
  //         <PopoverTrigger>
  //           <Button
  //             aria-label="Notifications"
  //             onClick={() => {
  //               setClickedOnNotifications(true)
  //               if (isOpen) return
  //               captureEvent("opened UserActivityLogPopover")
  //             }}
  //             // sx={{
  //             //   "@keyframes notification": {
  //             //     "0%": { transform: "rotate(0deg)" },
  //             //     "2.5%": { transform: "rotate(15deg)" },
  //             //     "5%": { transform: "rotate(-15deg)" },
  //             //     "7.5": { transform: "rotate(15deg)" },
  //             //     "10%": { transform: "rotate(0deg)" },
  //             //   },
  //             // }}
  //           >
  //             <Icon
  //               as={Bell}
  //               transformOrigin="top center"
  //               animation={
  //                 clickedOnNotifications || type !== "EVM"
  //                   ? undefined
  //                   : "notification 4s ease-in-out infinite"
  //               }
  //             />
  //           </Button>
  //         </PopoverTrigger>
  //
  //         <PopoverContent
  //           minW="none"
  //           maxW={`calc(100vw - ${2 * VIEWPORT_GAP_PX}px)`}
  //           w="400px"
  //         >
  //           <PopoverArrow />
  //           <PopoverCloseButton />
  //
  //           <PopoverBody py={3} px={0}>
  //             <Stack spacing={0}>
  //               {type === "EVM" && (
  //                 <NotificationsSection title="Messages">
  //                   <DynamicWeb3Inbox />
  //                 </NotificationsSection>
  //               )}
  //
  //               <Divider mb="4" />
  //
  //               <ActivityLogProvider
  //                 userId={id}
  //                 withSearchParams={false}
  //                 isInfinite={false}
  //                 limit={3}
  //               >
  //                 <NotificationsSection title="Recent activity">
  //                   <NotificationsActivityLog />
  //                 </NotificationsSection>
  //               </ActivityLogProvider>
  //             </Stack>
  //           </PopoverBody>
  //         </PopoverContent>
  //       </>
  //     )}
  //   </Popover>
  // )
}
