import { useContext } from "react"
import { Button } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import formatEtherscanLink from "utils/formatEtherscanLink"
import useENSName from "./hooks/useENSName"

type Props = {
  token: string
}

const Account = ({ token }: Props): JSX.Element => {
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
      leftIcon={<Wallet />}
      as="a"
      href={formatEtherscanLink("Account", [chainId, account])}
      target="_blank"
      rel="noopener noreferrer"
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </Button>
  )
}

export default Account
