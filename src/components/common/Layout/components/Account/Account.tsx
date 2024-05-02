import { ButtonGroup, Divider, HStack, Text, VStack } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/useResolveAddress"
import { useSetAtom } from "jotai"
import { SignIn } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import { accountModalAtom } from "./components/AccountModal"
import Notifications from "./components/Notifications/Notifications"

const Account = (): JSX.Element => {
  const { address } = useWeb3ConnectionManager()
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const domainName = useResolveAddress(address)
  const { addresses } = useUser()

  if (!address) {
    return (
      <AccountButton
        leftIcon={<SignIn />}
        onClick={() => setIsWalletSelectorModalOpen(true)}
        data-test="connect-wallet-button"
      >
        Sign in
      </AccountButton>
    )
  }

  const linkedAddressesCount = (addresses?.length ?? 1) - 1

  return (
    <ButtonGroup isAttached variant="ghost" alignItems="center" borderRadius="2xl">
      <Notifications />

      <Divider
        orientation="vertical"
        borderColor="whiteAlpha.300"
        /**
         * Space 11 is added to the theme by us and Chakra doesn't recognize it just
         * by "11" for some reason
         */
        h="var(--chakra-space-11)"
      />
      <AccountButton onClick={() => setIsAccountModalOpen(true)}>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="flex-end">
            <Text
              as="span"
              fontSize={linkedAddressesCount ? "sm" : "md"}
              fontWeight={linkedAddressesCount ? "bold" : "semibold"}
            >
              {domainName || `${shortenHex(address, 3)}`}
            </Text>
            {linkedAddressesCount && (
              <Text
                as="span"
                fontSize="xs"
                fontWeight="medium"
                color="whiteAlpha.600"
              >
                {`+ ${linkedAddressesCount} address${
                  linkedAddressesCount > 1 ? "es" : ""
                }`}
              </Text>
            )}
          </VStack>
          <GuildAvatar address={address} size={4} />
        </HStack>
      </AccountButton>
    </ButtonGroup>
  )
}

export default Account
