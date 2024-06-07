import { atom } from "jotai"
import WalletSelectorModal, { COINBASE_WALLET_SDK_ID } from "./WalletSelectorModal"

export const walletSelectorModalAtom = atom(false)

export default WalletSelectorModal
export { COINBASE_WALLET_SDK_ID }
