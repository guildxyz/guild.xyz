import { ButtonGroup, Divider, HStack, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { SignIn } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import DelegatePopoverWrapper from "./components/delegate/DelegatePopoverWrapper"
import UserActivityLogPopover from "./components/UserActivityLogPopover"

const Account = (): JSX.Element => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal, openAccountModal, triedEager } =
    useWeb3ConnectionManager()

  const domainName = useResolveAddress(account)
  const { addresses } = useUser()

  if (!account) {
    return (
      <AccountButton
        leftIcon={<SignIn />}
        isLoading={!triedEager}
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
                {domainName || `${shortenHex(account, 3)}`}
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
            <GuildAvatar address={account} size={4} />
          </HStack>
        </AccountButton>
      </DelegatePopoverWrapper>
    </ButtonGroup>
  )
}

export default Account
