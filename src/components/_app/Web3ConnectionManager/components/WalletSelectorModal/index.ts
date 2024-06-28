import { atom } from "jotai"
import WalletSelectorModal from "./WalletSelectorModal"
import { COINBASE_WALLET_SDK_ID } from "./constants"

export const walletSelectorModalAtom = atom(false)

export default WalletSelectorModal
export { COINBASE_WALLET_SDK_ID }
