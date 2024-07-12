import {
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { SectionProps } from "components/common/Section"
import { Question } from "phosphor-react"
import { PropsWithChildren, useMemo } from "react"
import rewards from "rewards"
import { PlatformName } from "types"
import useDelegateVaults from "../../delegate/useDelegateVaults"
import LinkAddressButton from "./LinkAddressButton"
import LinkDelegateVaultButton from "./LinkDelegateVaultButton"
import LinkedAddress, { LinkedAddressSkeleton } from "./LinkedAddress"
import SharedSocials from "./SharedSocials"
import SocialAccount, { EmailAddress } from "./SocialAccount"
import FarcasterProfile from "./SocialAccount/FarcasterProfile"

const AccountConnections = () => {
  const { isLoading, addresses, platformUsers, sharedSocials } = useUser()
  const vaults = useDelegateVaults()

  const orderedSocials = useMemo(() => {
    const connectedPlatforms =
      platformUsers
        ?.filter((platformUser) => rewards[platformUser.platformName].isPlatform)
        ?.map((platformUser) => platformUser.platformName as string) ?? []
    const notConnectedPlatforms = Object.keys(rewards).filter(
      (platform) =>
        rewards[platform].isPlatform && !connectedPlatforms?.includes(platform)
    )
    return [...connectedPlatforms, ...notConnectedPlatforms] as PlatformName[]
  }, [platformUsers])

  return (
    <>
      <AccountSectionTitle
        title="Social accounts"
        titleRightElement={sharedSocials?.length > 0 ? <SharedSocials /> : undefined}
      />
      <AccountSection mb="6" divider={<Divider />}>
        {orderedSocials.map((platform) =>
          platform === "EMAIL" ? (
            <EmailAddress key={"EMAIL"} />
          ) : platform === "FARCASTER" ? (
            <FarcasterProfile key={"FARCASTER"} />
          ) : (
            <SocialAccount key={platform} type={platform} />
          )
        )}
      </AccountSection>

      <AccountSectionTitle
        title="Linked addresses"
        titleRightElement={
          addresses?.length > 1 ? (
            <>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Icon as={Question} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    Each of your addresses will be used for requirement checks
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Spacer />
              <LinkAddressButton variant="ghost" my="-1 !important" />
            </>
          ) : undefined
        }
        spacing={3}
        pt="4"
      />

      <AccountSection divider={<Divider />}>
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
      </AccountSection>
    </>
  )
}

export const AccountSection = ({
  children,
  ...rest
}: PropsWithChildren<StackProps>) => {
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
