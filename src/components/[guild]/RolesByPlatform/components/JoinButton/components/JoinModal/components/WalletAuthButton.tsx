import { useWeb3React } from "@web3-react/core"
import ModalButton from "components/common/ModalButton"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"
import { useContext } from "react"
import ConnectedAccount from "./ConnectedAccount"

const WalletAuthButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { isActive } = useWeb3React()

  if (isActive)
    return <ConnectedAccount icon={<Wallet />}>Wallet connected</ConnectedAccount>

  return <ModalButton onClick={openWalletSelectorModal}>Connect wallet</ModalButton>
}

export default WalletAuthButton
