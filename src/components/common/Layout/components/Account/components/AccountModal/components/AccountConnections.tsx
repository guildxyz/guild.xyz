import {
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
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { SectionProps } from "components/common/Section"
import { Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformName } from "types"
import LinkAddressButton from "./LinkAddressButton"
import LinkedAddress from "./LinkedAddress"
import SocialAccount from "./SocialAccount"

const AccountConnections = () => {
  const { isLoading, addresses } = useUser()
  const { account } = useWeb3React()
  const { platformUsers } = useUser()

  const orderedSocials = useMemo(() => {
    const connectedPlatforms = platformUsers?.map(
      (platformUser) => platformUser.platformName as string
    )
    const notConnectedPlatforms = Object.keys(platforms).filter(
      (platform) => platform !== "POAP" && !connectedPlatforms.includes(platform)
    )
    return [...connectedPlatforms, ...notConnectedPlatforms] as PlatformName[]
  }, [platformUsers])

  const bg = useColorModeValue("gray.50", "blackAlpha.200")

  return (
    <>
      <AccountSectionTitle title="Social accounts" />
      <Stack
        bg={bg}
        w="full"
        borderWidth="1px"
        borderRadius={"xl"}
        px="4"
        py="3.5"
        spacing={3}
        mb="6"
        divider={<Divider />}
      >
        {}
        {orderedSocials.map((platform) => (
          <SocialAccount
            key={platform}
            type={platform}
            // icon={value.icon}
            // colorScheme={value.colorScheme}
            // name={value.name}
          />
        ))}
      </Stack>
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
      <Stack
        bg={bg}
        w="full"
        borderWidth="1px"
        borderRadius={"xl"}
        px="4"
        py="3.5"
        spacing={3}
      >
        {isLoading ? (
          <Spinner />
        ) : addresses?.length === 1 && addresses?.[0] === account.toLowerCase() ? (
          <HStack justifyContent={"space-between"} w="full">
            <Text /* colorScheme={"gray"} */ fontSize={"sm"} fontWeight={"medium"}>
              No linked addresses yet
            </Text>
            <LinkAddressButton />
          </HStack>
        ) : (
          <Stack
            spacing={3}
            pt="2"
            alignItems="start"
            w="full"
            divider={<Divider />}
          >
            {addresses
              ?.filter((address) => address?.toLowerCase() !== account.toLowerCase())
              .map((address) => (
                <LinkedAddress key={address} address={address} />
              ))}
          </Stack>
        )}
      </Stack>
    </>
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
