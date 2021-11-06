import { HStack, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useUser from "components/[guild]/hooks/useUser"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountModal from "./components/AccountModal"
import useENSName from "./hooks/useENSName"

const Account = (): JSX.Element => {
  const { error, account, chainId } = useWeb3React()
  const { openWalletSelectorModal, triedEager, openNetworkModal } =
    useContext(Web3Connection)
  const ENSName = useENSName(account)
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()
  const { addresses } = useUser()

  if (typeof window === "undefined") {
    return <AccountButton isLoading>Connect to a wallet</AccountButton>
  }

  if (error instanceof UnsupportedChainIdError) {
    return (
      <AccountButton
        leftIcon={<LinkBreak />}
        colorScheme="red"
        onClick={openNetworkModal}
      >
        Wrong Network
      </AccountButton>
    )
  }
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
  return (
    <>
      <AccountButton onClick={onAccountModalOpen}>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="flex-end">
            <Text
              as="span"
              fontSize={addresses?.length > 1 ? "sm" : "md"}
              fontWeight={addresses?.length > 1 ? "bold" : "semibold"}
            >
              {ENSName || `${shortenHex(account, 3)}`}
            </Text>
            {addresses?.length > 1 && (
              <Text
                as="span"
                fontSize="xs"
                fontWeight="medium"
                color="whiteAlpha.600"
              >
                {`+ ${addresses.length - 1} addresses`}
              </Text>
            )}
          </VStack>
          <GuildAvatar address={account} size={4} />
        </HStack>
      </AccountButton>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </>
  )
}

export default Account
