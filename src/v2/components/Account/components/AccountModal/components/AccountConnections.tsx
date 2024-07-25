import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { Question } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import { Fragment, useMemo } from "react"
import rewards from "rewards"
import { PlatformName } from "types"
import useDelegateVaults from "../hooks/useDelegateVaults"
import { AccountSection, AccountSectionTitle } from "./AccountSection"
import EmailAddress from "./EmailAddress"
import FarcasterProfile from "./FarcasterProfile"
import LinkAddressButton from "./LinkAddressButton"
import LinkDelegateVaultButton from "./LinkDelegateVaultButton"
import LinkedAddress, { LinkedAddressSkeleton } from "./LinkedAddress"
import SharedSocials from "./SharedSocials"
import { SocialAccount } from "./SocialAccount"

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
    <div className="flex flex-col">
      <AccountSectionTitle
        title="Social accounts"
        titleRightElement={sharedSocials?.length > 0 ? <SharedSocials /> : undefined}
        className="justify-between"
      />
      <AccountSection className="mb-6">
        {orderedSocials.map((platform, i) => (
          <Fragment key={platform}>
            {platform === "EMAIL" ? (
              <EmailAddress />
            ) : platform === "FARCASTER" ? (
              <FarcasterProfile />
            ) : (
              <SocialAccount type={platform} />
            )}
            {i < orderedSocials.length - 1 && (
              <Separator className="bg-border-muted" />
            )}
          </Fragment>
        ))}
      </AccountSection>

      <AccountSectionTitle
        title="Linked addresses"
        className="gap-1.5"
        titleRightElement={
          addresses?.length > 1 ? (
            <div className="flex w-full items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Question weight="bold" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Each of your addresses will be used for requirement checks</p>
                </TooltipContent>
              </Tooltip>
              <LinkAddressButton variant="ghost" className="-my-1" />
            </div>
          ) : undefined
        }
      />

      <AccountSection>
        {isLoading ? (
          <LinkedAddressSkeleton />
        ) : !(addresses?.length > 1) ? (
          <div
            className={cn("flex flex-col gap-2", {
              "flex-row items-center justify-between": !vaults?.length,
            })}
          >
            <p className="font-medium text-sm">No linked addresses yet</p>
            {vaults?.length ? (
              <div className="flex gap-1">
                <LinkAddressButton />
                <LinkDelegateVaultButton vaults={vaults} />
              </div>
            ) : (
              <LinkAddressButton />
            )}
          </div>
        ) : (
          addresses
            .map((addressData, i) => (
              <Fragment key={addressData.address}>
                <LinkedAddress addressData={addressData} />
                {i < addresses.length - 1 && (
                  <Separator className="bg-border-muted" />
                )}
              </Fragment>
            ))
            .concat(
              vaults?.length > 0 ? <LinkDelegateVaultButton vaults={vaults} /> : []
            )
        )}
      </AccountSection>
    </div>
  )
}

export { AccountConnections }
