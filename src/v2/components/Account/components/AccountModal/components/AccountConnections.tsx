import { cn } from "@/lib/utils"
import useUser from "components/[guild]/hooks/useUser"
import useDelegateVaults from "components/common/Layout/components/Account/components/delegate/useDelegateVaults"
import { ReactNode, useMemo } from "react"
import { PlatformName } from "types"
import { SocialAccount } from "./SocialAccount"
import rewards from "rewards"

const AccountConnections = () => {
  const { isLoading, addresses, platformUsers, sharedSocials } = useUser()
  const vaults = useDelegateVaults()

  const orderedSocials = useMemo(() => {
    const connectedPlatforms =
      platformUsers
        ?.filter((platformUser) => rewards[platformUser.platformName]?.isPlatform)
        ?.map((platformUser) => platformUser.platformName as string) ?? []
    const notConnectedPlatforms = Object.keys(rewards).filter(
      (platform) =>
        rewards[platform].isPlatform && !connectedPlatforms?.includes(platform)
    )
    return [...connectedPlatforms, ...notConnectedPlatforms] as PlatformName[]
  }, [platformUsers])

  return (
    <div className="flex flex-col gap-1">
      {/* TODO: rightElement */}
      <AccountSectionTitle title="Social accounts" />
      <AccountSection className="mb-6">
        {orderedSocials.map((platform, i) => (
          <>
            {platform === "EMAIL" ? (
              <></>
            ) : // <EmailAddress key={"EMAIL"} />
            platform === "FARCASTER" ? (
              <></>
            ) : (
              // <FarcasterProfile key={"FARCASTER"} />
              <SocialAccount key={platform} type={platform} />
            )}
            {i < orderedSocials.length - 1 && (
              <hr className="border-border-secondary" />
            )}
          </>
        ))}
      </AccountSection>

      <AccountSectionTitle title="Linked addresses" />
      <AccountSection>TODO</AccountSection>
    </div>
  )
}

const AccountSectionTitle = ({
  title,
  titleRightElement,
}: {
  title: string
  titleRightElement?: ReactNode
}) => (
  <div className="mb-3 flex w-full items-center">
    <span className="text-sm font-bold text-muted-foreground">{title}</span>
    {titleRightElement}
  </div>
)

const AccountSection = ({
  className,
  children,
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "flex flex-col gap-3 rounded-xl border bg-card-secondary px-4 py-3.5",
      className
    )}
  >
    {children}
  </div>
)

export { AccountConnections }
