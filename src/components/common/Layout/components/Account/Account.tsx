import { HStack, Text, useDisclosure } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { LinkBreak } from "phosphor-react"
import { useContext } from "react"
import SignIn from "static/icons/signin.svg"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountModal from "./components/AccountModal"
import Identicon from "./components/Identicon"
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
  if (typeof account !== "string") {
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
        <HStack>
          <Text as="span" fontSize="md" fontWeight="semibold">
            {ENSName || `${shortenHex(account, 3)}`}
          </Text>
          <Identicon address={account} size={24} />
        </HStack>
      </AccountButton>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </>
  )
}

export default Account
