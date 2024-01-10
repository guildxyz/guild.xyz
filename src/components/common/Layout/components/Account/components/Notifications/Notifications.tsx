import {
  Divider,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react"
import { ActivityLogProvider } from "components/[guild]/activity/ActivityLogContext"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useLocalStorage from "hooks/useLocalStorage"
import dynamic from "next/dynamic"
import { Bell } from "phosphor-react"
import AccountButton from "../AccountButton"
import WebInboxSkeleton from "../Web3Inbox/WebInboxSkeleton"
import NotificationsActivityLog from "./components/NotificationsActivityLog"
import NotificationsSection from "./components/NotificationsSection"

const DynamicWeb3Inbox = dynamic(() => import("../Web3Inbox"), {
  ssr: false,
  loading: WebInboxSkeleton,
})
const VIEWPORT_GAP_PX = 8

const Notifications = () => {
  const { id } = useUser()
  const { captureEvent } = usePostHogContext()

  const [clickedOnNotifications, setClickedOnNotifications] = useLocalStorage(
    "clicked-web3inbox-feature-notification",
    false
  )

  const { type } = useWeb3ConnectionManager()

  return (
    <Popover
      placement="bottom"
      isLazy
      strategy="absolute"
      closeOnBlur={false}
      modifiers={[
        { name: "preventOverflow", options: { padding: VIEWPORT_GAP_PX } },
      ]}
    >
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <AccountButton
              aria-label="Notifications"
              onClick={() => {
                setClickedOnNotifications(true)
                if (isOpen) return
                captureEvent("opened UserActivityLogPopover")
              }}
              sx={{
                "@keyframes notification": {
                  "0%": { transform: "rotate(0deg)" },
                  "2.5%": { transform: "rotate(15deg)" },
                  "5%": { transform: "rotate(-15deg)" },
                  "7.5": { transform: "rotate(15deg)" },
                  "10%": { transform: "rotate(0deg)" },
                },
              }}
            >
              <Icon
                as={Bell}
                transformOrigin="top center"
                animation={
                  clickedOnNotifications || type !== "EVM"
                    ? undefined
                    : "notification 4s ease-in-out infinite"
                }
              />
            </AccountButton>
          </PopoverTrigger>

          <PopoverContent
            minW="none"
            maxW={`calc(100vw - ${2 * VIEWPORT_GAP_PX}px)`}
            w="400px"
          >
            <PopoverArrow />
            <PopoverCloseButton />

            <PopoverBody py={3} px={0}>
              <Stack spacing={0}>
                {type === "EVM" && (
                  <NotificationsSection title="Messages">
                    <DynamicWeb3Inbox />
                  </NotificationsSection>
                )}

                <Divider mb="4" />

                <ActivityLogProvider
                  userId={id}
                  withSearchParams={false}
                  isInfinite={false}
                >
                  <NotificationsSection title="Recent activity">
                    <NotificationsActivityLog />
                  </NotificationsSection>
                </ActivityLogProvider>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

export default Notifications
