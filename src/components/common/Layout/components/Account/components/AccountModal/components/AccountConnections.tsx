import { Spinner, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/common/Section"
import useUser from "components/[guild]/hooks/useUser"
import LinkedAddress from "./LinkedAddress"
import LinkedSocialAccount from "./LinkedSocialAccount"

const AccountConnections = () => {
  const { isLoading, addresses, discordId, telegramId, discord, telegram } =
    useUser()
  const { account } = useWeb3React()

  return (
    <Stack spacing="10" w="full">
      <Section title="Linked social accounts">
        {isLoading ? (
          <Spinner />
        ) : typeof discordId === "boolean" && typeof telegramId === "boolean" ? (
          <Text colorScheme="gray">
            {`${[discordId && "Discord", telegramId && "Telegram"]
              .filter(Boolean)
              .join(
                " and "
              )} hidden. Verify that you're the owner of this account below to view`}
          </Text>
        ) : (
          <>
            {discord?.username && (
              <LinkedSocialAccount
                name={discord.username}
                image={discord.avatar}
                type="DISCORD"
              />
            )}
            {telegram?.username && (
              <LinkedSocialAccount
                name={telegram.username}
                image={telegram.avatar}
                type="TELEGRAM"
              />
            )}
          </>
        )}
      </Section>
      <Section
        title="Linked addresses"
        /* titleRightElement={
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
            </>
          )
        } */
      >
        {isLoading ? (
          <Spinner />
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
    </Stack>
  )
}

export default AccountConnections
