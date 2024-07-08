import useUser from "components/[guild]/hooks/useUser"
import { useMemo } from "react"
import rewards from "rewards"
import { PlatformName } from "types"
import useDelegateVaults from "../hooks/useDelegateVaults"
import { AccountSection, AccountSectionTitle } from "./AccountSection"
import EmailAddress from "./EmailAddress"
import FarcasterProfile from "./FarcasterProfile"
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
    <div className="flex flex-col gap-1">
      <AccountSectionTitle
        title="Social accounts"
        titleRightElement={sharedSocials?.length > 0 ? <SharedSocials /> : undefined}
        className="justify-between"
      />
      <AccountSection className="mb-6">
        {orderedSocials.map((platform, i) => (
          <>
            {platform === "EMAIL" ? (
              <EmailAddress key="EMAIL" />
            ) : platform === "FARCASTER" ? (
              <FarcasterProfile key="FARCASTER" />
            ) : (
              <SocialAccount key={platform} type={platform} />
            )}
            {i < orderedSocials.length - 1 && <hr className="border-border-muted" />}
          </>
        ))}
      </AccountSection>

      <AccountSectionTitle
        title="Linked addresses"
        // className="gap-3 pt-4"
        // TODO:
        // titleRightElement={
        //   addresses?.length > 1 ? (
        //     <>
        //       <Popover placement="top" trigger="hover">
        //         <PopoverTrigger>
        //           <Question />
        //         </PopoverTrigger>
        //         <PopoverContent>
        //           <PopoverArrow />
        //           <PopoverBody>
        //             Each of your addresses will be used for requirement checks
        //           </PopoverBody>
        //         </PopoverContent>
        //       </Popover>
        //       <Spacer />
        //       <LinkAddressButton variant="ghost" my="-1 !important" />
        //     </>
        //   ) : undefined
        // }
      />

      {/* <AccountSection divider={<Divider />}>
        {isLoading ? (
          <LinkedAddressSkeleton />
        ) : !(addresses?.length > 1) ? (
          <Stack
            {...(!vaults?.length && {
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
            })}
          >
            <Text fontSize={"sm"} fontWeight={"medium"}>
              No linked addresses yet
            </Text>
            {vaults?.length ? (
              <ButtonGroup w="full">
                <LinkAddressButton />
                <LinkDelegateVaultButton vaults={vaults} />
              </ButtonGroup>
            ) : (
              <LinkAddressButton />
            )}
          </Stack>
        ) : (
          addresses
            .map((addressData) => (
              <LinkedAddress key={addressData?.address} addressData={addressData} />
            ))
            .concat(
              vaults?.length > 0 ? <LinkDelegateVaultButton vaults={vaults} /> : []
            )
        )}
      </AccountSection> */}
    </div>
  )
}

export { AccountConnections }
