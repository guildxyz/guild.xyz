import { ButtonGroup, Divider, HStack, Text, VStack } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { SignIn } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"
import AccountButton from "./components/AccountButton"
import UserActivityLogPopover from "./components/UserActivityLogPopover"
import DelegatePopoverWrapper from "./components/delegate/DelegatePopoverWrapper"

const Account = (): JSX.Element => {
  const { address, isConnected } = useAccount()
  const { openWalletSelectorModal, openAccountModal, triedEager } =
    useWeb3ConnectionManager()

  const domainName = useResolveAddress(address)
  const { addresses } = useUser()

  if (!isConnected) {
    return (
      <AccountButton
        leftIcon={<SignIn />}
        // isLoading={!triedEager}
        onClick={openWalletSelectorModal}
      >
        Connect to a wallet
      </AccountButton>
    )
  }

  const linkedAddressesCount = (addresses?.length ?? 1) - 1

  return (
    <ButtonGroup isAttached variant="ghost" alignItems="center" borderRadius="2xl">
      <UserActivityLogPopover />

      <Divider
        orientation="vertical"
        borderColor="whiteAlpha.300"
        /**
         * Space 11 is added to the theme by us and Chakra doesn't recognize it just
         * by "11" for some reason
         */
        h="var(--chakra-space-11)"
      />
      <DelegatePopoverWrapper>
        <AccountButton onClick={openAccountModal}>
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
      </DelegatePopoverWrapper>
    </ButtonGroup>
  )
}

export default Account
