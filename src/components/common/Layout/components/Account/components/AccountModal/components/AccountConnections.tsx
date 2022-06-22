import {
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Section from "components/common/Section"
import useUser from "components/[guild]/hooks/useUser"
import { ArrowClockwise, Question } from "phosphor-react"
import { PlatformName, PlatformType } from "types"
import LinkedAddress from "./LinkedAddress"
import LinkedSocialAccount from "./LinkedSocialAccount"

const avatarToURL = (
  platformName: PlatformName,
  platformUserId: string,
  avatar: string
) => {
  switch (platformName) {
    case "DISCORD":
      return `https://cdn.discordapp.com/avatars/${platformUserId}/${avatar}.png`
    default:
      return avatar
  }
}

const AccountConnections = () => {
  const {
    isLoading,
    isSigning,
    addresses,
    linkedAddressesCount,
    verifyAddress,
    discordId,
    telegramId,
    platformUsers,
  } = useUser()
  const { account } = useWeb3React()

  return (
    <Stack spacing="10" w="full">
      <Section
        title="Linked social accounts"
        titleRightElement={
          Array.isArray(addresses) && (
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Reload linked accounts"
              icon={<ArrowClockwise size={14} />}
              isLoading={isSigning}
              borderRadius="full"
              onClick={verifyAddress}
              ml="auto !important"
            />
          )
        }
      >
        {isLoading ? (
          <Spinner />
        ) : !!platformUsers?.[0] && !("platformUserId" in platformUsers[0]) ? (
          <Text colorScheme="gray">
            {`${platformUsers
              ?.map(
                (platformUser) =>
                  /**
                   * TODO: Should have an object which maps PlatformNames to
                   * labels/displayable strings, (DISCORD -> Discord, GITHUB -> GitHub)
                   */
                  `${platformUser.platformName[0].toUpperCase()}${platformUser.platformName
                    .slice(1)
                    .toLowerCase()}`
              )
              .join(
                " and "
              )} hidden. Verify that you're the owner of this account below to view`}
          </Text>
        ) : platformUsers.length > 0 ? (
          platformUsers?.map(
            ({ platformId, platformUserId, username, avatar, platformName }) => (
              <LinkedSocialAccount
                key={platformUserId}
                name={username}
                image={avatarToURL(platformName, platformUserId, avatar)}
                type={PlatformType[platformId] as PlatformName}
              />
            )
          )
        ) : (
          <Text colorScheme={"gray"}>No social accounts</Text>
        )}
      </Section>
      <Section
        title="Linked addresses"
        titleRightElement={
          linkedAddressesCount && (
            <>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Icon as={Question} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    If you join a guild with another address, but with the same
                    Discord account, your addresses will be linked together and each
                    will be used for requirement checks.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              {Array.isArray(addresses) && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Reload linked addresses"
                  icon={<ArrowClockwise size={14} />}
                  isLoading={isSigning}
                  borderRadius="full"
                  onClick={verifyAddress}
                  ml="auto !important"
                />
              )}
            </>
          )
        }
      >
        {isLoading ? (
          <Spinner />
        ) : !linkedAddressesCount ? (
          <Text colorScheme="gray">
            If you join a guild with another address, but with the same Discord
            account, your addresses will be linked together and each will be used for
            requirement checks.
          </Text>
        ) : !Array.isArray(addresses) ? (
          <Text colorScheme="gray">
            {linkedAddressesCount} address{linkedAddressesCount > 1 && "es"} hidden.
            Verify that you're the owner of this account below to view
          </Text>
        ) : (
          <Stack spacing={4} pt="2" alignItems="start" w="full">
            {addresses
              .filter((address) => address?.toLowerCase() !== account.toLowerCase())
              .map((address) => (
                <LinkedAddress key={address} address={address} />
              ))}
          </Stack>
        )}
      </Section>
      {(linkedAddressesCount || discordId || telegramId) &&
        !Array.isArray(addresses) && (
          <Button
            onClick={verifyAddress}
            isLoading={isSigning}
            loadingText="Check your wallet"
          >
            Sign message to verify address
          </Button>
        )}
    </Stack>
  )
}

export default AccountConnections
