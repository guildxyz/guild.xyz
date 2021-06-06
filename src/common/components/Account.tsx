import { useContext } from "react"
import { Button, Link } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import { Web3Connection } from "modules/web3Connection"
import useENSName from "../hooks/useENSName"
import formatEtherscanLink from "../../utils/formatEtherscanLink"
import shortenHex from "../../utils/shortenHex"

const Account = (): JSX.Element => {
  const { active, error, chainId, account } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)

  if (typeof window === "undefined") {
    return <Button isLoading>Connect to a wallet</Button>
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Button onClick={openModal} leftIcon={<LinkBreak />} colorScheme="red">
        Wrong Network
      </Button>
    )
  }
  if (typeof account !== "string") {
    return (
      <Button isLoading={!triedEager} onClick={openModal} leftIcon={<SignIn />}>
        Connect to a wallet
      </Button>
    )
  }
  return (
    <Button
      as="a"
      href={formatEtherscanLink("Account", [chainId, account])}
      target="_blank"
      rel="noopener noreferrer"
      leftIcon={<Wallet />}
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </Button>
  )
}

export default Account
