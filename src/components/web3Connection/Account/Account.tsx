/* eslint-disable @typescript-eslint/dot-notation */
import { useCommunity } from "components/community/Context"
import { useContext } from "react"
import { Button, ButtonGroup, Divider, useDisclosure } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import { Token } from "temporaryData/types"
import Card from "components/common/Card"
import useBalance from "./hooks/useBalance"
import useENSName from "./hooks/useENSName"
import AccountModal from "../AccountModal"

type Props = {
  token: Token
}

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()

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
    <>
      <Card>
        <ButtonGroup isAttached variant="ghost">
          {!!communityData && (
            <>
              <Balance token={communityData.chainData["token"]} />
              <Divider orientation="vertical" h="var(--chakra-space-11)" />
            </>
          )}
          <Button leftIcon={<Wallet />} onClick={onOpen}>
            {ENSName || `${shortenHex(account, 4)}`}
          </Button>
        </ButtonGroup>
      </Card>
      <AccountModal {...{ isOpen, onClose }} />
    </>
  )
}

const Balance = ({ token }: Props): JSX.Element => {
  const { data: balance } = useBalance(token)

  return (
    <Button mr="-px" isLoading={!balance}>
      {`${balance} ${token.name}`}
    </Button>
  )
}

export default Account
