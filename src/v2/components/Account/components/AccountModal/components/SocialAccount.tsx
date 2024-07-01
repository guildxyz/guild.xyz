import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useDisconnect from "components/common/Layout/components/Account/components/AccountModal/hooks/useDisconnect"
import useMembership from "components/explorer/hooks/useMembership"
import { motion } from "framer-motion"
import rewards from "platforms/rewards"
import { ReactNode } from "react"
import { PlatformName } from "types"
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

const SocialAccountUI = ({
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
          "relative flex size-7 items-center justify-center rounded-full bg-card text-white",
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
                "absolute -bottom-0.5 -right-1 flex size-4 items-center justify-center rounded-full border border-card-secondary",
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

      <span className="line-clamp-1 text-sm font-bold">
        {username ?? `${platformName} ${isConnected ? "connected" : ""}`}
      </span>

      {children}
    </motion.div>
  )
}

// TODO: we should move these to `rewards.ts` eventually
const PLATFORM_COLORS = {
  DISCORD: "bg-discord",
  TELEGRAM: "bg-telegram",
  EMAIL: "bg-blue-500",
  GOOGLE: "bg-blue-500",
  TWITTER_V1: "bg-twitter",
  TWITTER: "bg-twitter",
  GITHUB: "bg-github",
  POLYGON_ID: "bg-polygonid",
  FARCASTER: "bg-farcaster",
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
      // TODO: use the proper colors
      // colorScheme={isReconnect ? "orange" : rewards[type].colorScheme}
      // variant={isReconnect ? "subtle" : "solid"}
      size="sm"
      className={cn("ml-auto", PLATFORM_COLORS[type])}
    >
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
