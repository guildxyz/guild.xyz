import {
  ButtonGroup,
  Divider,
  Heading,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { SectionProps } from "components/common/Section"
import { Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformName } from "types"
import { useAccount } from "wagmi"
import useDelegateVaults from "../../delegate/useDelegateVaults"
import LinkAddressButton from "./LinkAddressButton"
import LinkDelegateVaultButton from "./LinkDelegateVaultButton"
import LinkedAddress, { LinkedAddressSkeleton } from "./LinkedAddress"
import SharedSocials from "./SharedSocials"
import SocialAccount, { EmailAddress } from "./SocialAccount"

const AccountConnections = () => {
  const {
    isLoading,
    addresses,
    platformUsers,
    id: userId,
    addressProviders,
    sharedSocials,
  } = useUser()
  const { address } = useAccount()
  const vaults = useDelegateVaults()

  const orderedSocials = useMemo(() => {
    const connectedPlatforms =
      platformUsers?.map((platformUser) => platformUser.platformName as string) ?? []
    const notConnectedPlatforms = Object.keys(platforms).filter(
      (platform) =>
        !["POAP", "CONTRACT_CALL", "EMAIL", "UNIQUE_TEXT", "TEXT"].includes(
          platform
        ) && !connectedPlatforms?.includes(platform)
    )
    return [
      ...connectedPlatforms,
      "EMAIL",
      ...notConnectedPlatforms,
    ] as PlatformName[]
  }, [platformUsers])

  const linkedAddresses = addresses?.filter(
    (addr) =>
      (typeof addr === "string" ? addr : addr?.address)?.toLowerCase() !==
      address.toLowerCase()
  )

  return (
    <>
      <AccountSectionTitle
        title="Social accounts"
        titleRightElement={sharedSocials?.length && <SharedSocials />}
      />
      <AccountSection mb="6" divider={<Divider />}>
        {orderedSocials.map((platform) =>
          platform === "EMAIL" ? (
            <EmailAddress key={"EMAIL"} />
          ) : (
            <SocialAccount key={platform} type={platform} />
          )
        )}
      </AccountSection>
      <AccountSectionTitle
        title="Linked addresses"
        titleRightElement={
          addresses?.length > 1 && (
            <>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Icon as={Question} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    Each of your addresses will be used for requirement checks.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Spacer />
              <LinkAddressButton variant="ghost" my="-1 !important" />
            </>
          )
        }
        spacing={3}
        pt="4"
      />
      <AccountSection divider={<Divider />}>
        {isLoading ? (
          <LinkedAddressSkeleton />
        ) : !linkedAddresses?.length ? (
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
          linkedAddresses
            .map((addressData) =>
              typeof addressData === "string" ? (
                <LinkedAddress
                  key={addressData}
                  addressData={{
                    address: addressData,
                    userId,
                    createdAt: null,
                    isPrimary: addresses.findIndex((a) => a === addressData) === 0,
                    provider: addressProviders?.[addressData],
                  }}
                />
              ) : (
                <LinkedAddress
                  key={addressData?.address}
                  addressData={addressData}
                />
              )
            )
            .concat(
              vaults?.length ? <LinkDelegateVaultButton vaults={vaults} /> : null
            )
        )}
      </AccountSection>
    </>
  )
}

const AccountSection = ({ children, ...rest }) => {
  const bg = useColorModeValue("gray.50", "blackAlpha.200")

  return (
    <Stack
      bg={bg}
      w="full"
      borderWidth="1px"
      borderRadius={"xl"}
      px="4"
      py="3.5"
      spacing={3}
      {...rest}
    >
      {children}
    </Stack>
  )
}

export const AccountSectionTitle = ({ title, titleRightElement }: SectionProps) => (
  <HStack mb="3" w="full">
    <Heading fontSize={"sm"} as="h3" opacity="0.6" fontWeight={"bold"}>
      {title}
    </Heading>
    {titleRightElement}
  </HStack>
)

export default AccountConnections
