import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { Warning } from "@phosphor-icons/react/dist/ssr"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useMembership from "components/explorer/hooks/useMembership"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import rewards from "rewards"
import { PlatformName } from "types"
import useDisconnect from "../hooks/useDisconnect"
import { DisconnectAccountButton } from "./DisconnectAccountButton"

const SocialAccount = ({ type }: { type: PlatformName }): JSX.Element => {
  const { platformUsers } = useUser()
  const platformUser = platformUsers?.find(
    (platform) => platform.platformName.toString() === type
  )
  const isConnected = !!platformUser

  const { membership } = useMembership()

  const isReconnect =
    !!membership &&
    membership?.roles?.some(({ requirements }) =>
      requirements?.some(
        ({ errorType, subType }) =>
          errorType === "PLATFORM_CONNECT_INVALID" && subType?.toUpperCase() === type
      )
    )

  return (
    <SocialAccountUI
      type={type}
      avatarUrl={platformUser?.platformUserData?.avatar}
      username={platformUser?.platformUserData?.username}
      isConnected={isConnected}
    >
      {!isConnected ? (
        <ConnectPlatformButton type={type} />
      ) : (
        <div className="ml-auto flex items-center gap-1">
          {isReconnect && <ConnectPlatformButton type={type} isReconnect />}
          <DisconnectPlatformButton type={type} />
        </div>
      )}
    </SocialAccountUI>
  )
}

export const SocialAccountUI = ({
  type,
  avatarUrl,
  username,
  isConnected,
  children,
}: {
  type: PlatformName
  avatarUrl?: string
  username?: string
  isConnected?: boolean
  children: ReactNode
}) => {
  const { icon: IconComponent, name: platformName } = rewards[type]
  const bgClassName = PLATFORM_COLORS[type] ?? ""

  return (
    <motion.div layout className="flex w-full items-center gap-3">
      <div
        className={cn(
          "relative flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-white",
          bgClassName
        )}
      >
        {!!avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt={username}
              className="h-full w-full rounded-full object-cover"
            />
            <div
              className={cn(
                "-bottom-0.5 -right-1 absolute flex size-4 items-center justify-center rounded-full border border-card-secondary",
                bgClassName
              )}
            >
              <IconComponent weight="bold" className="size-2.5" />
            </div>
          </>
        ) : (
          <IconComponent weight="bold" className="size-4" />
        )}
      </div>

      <span className="overflow-hidden text-ellipsis font-bold text-sm">
        {username ?? `${platformName} ${isConnected ? "connected" : ""}`}
      </span>

      {children}
    </motion.div>
  )
}

// TODO: we should move these to `rewards.ts` eventually
const PLATFORM_COLORS = {
  DISCORD: "bg-discord hover:bg-discord-hover active:bg-discord-active",
  TELEGRAM: "bg-telegram hover:bg-telegram-hover active:bg-telegram-active",
  EMAIL: "bg-email hover:bg-email-hover active:bg-email-active",
  GOOGLE: "bg-google hover:bg-google-hover active:bg-google-active",
  TWITTER_V1: "bg-twitter hover:bg-twitter-hover active:bg-twitter-active",
  TWITTER: "bg-twitter hover:bg-twitter-hover active:bg-twitter-active",
  GITHUB: "bg-github hover:bg-github-hover active:bg-github-active",
  POLYGON_ID: "bg-polygonid hover:bg-polygonid-hover active:bg-polygonid-active",
  FARCASTER: "bg-farcaster hover:bg-farcaster-hover active:bg-farcaster-active",
  WORLD_ID: "bg-worldid hover:bg-worldid-hover active:bg-worldid-active",
} satisfies Partial<Record<PlatformName, string>>

const ConnectPlatformButton = ({
  type,
  isReconnect = false,
}: {
  type: PlatformName
  isReconnect?: boolean
}) => {
  const { toast } = useToast()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const onSuccess = () => {
    toast({
      title: `Account successfully connected`,
      variant: "success",
    })
    triggerMembershipUpdate()
  }

  const { isLoading, response, onConnect } = useConnectPlatform(
    type as PlatformName,
    onSuccess,
    isReconnect
  )

  return (
    <Button
      onClick={onConnect}
      isLoading={isLoading}
      disabled={!!response}
      colorScheme={isReconnect ? "secondary" : "primary"}
      size="sm"
      className={cn("ml-auto", PLATFORM_COLORS[type])}
    >
      {isReconnect && (
        <Warning weight="bold" className="text-orange-400 dark:text-orange-200" />
      )}
      {isReconnect ? "Reconnect" : "Connect"}
    </Button>
  )
}

const DisconnectPlatformButton = ({ type }: { type: PlatformName }) => {
  const disclosureState = useDisclosure()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(
    disclosureState.onClose
  )
  const onConfirm = () => onSubmit({ platformName: type })
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectAccountButton
      {...{
        state: disclosureState,
        isLoading,
        loadingText,
        onConfirm,
        name: rewards[type].name,
      }}
    />
  )
}

export { PLATFORM_COLORS, SocialAccount }
