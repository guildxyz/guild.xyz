import { RPC } from "connectors"
import { allPurchaseSupportedChains } from "pages/api/fetchPrice"
import { RequirementType } from "requirements"

const PURCHASABLE_REQUIREMENT_TYPES: RequirementType[] = [
  "ERC20",
  "ERC721",
  "ERC1155",
]

const SUPPORTED_CURRENCIES: { chainId: number; address: string }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: RPC[c].chainId,
    address: RPC[c].nativeCurrency.symbol,
  })),
  // USDC
  {
    chainId: 1,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  // DAI
  {
    chainId: 1,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  // DAI
  {
    chainId: 5,
    address: "0x73967c6a0904aa032c103b4104747e88c566b1a2",
  },
]

const PROTOCOL_FEES_PERCENTAGE = {
  UNISWAP_V2: 0.3,
  UNISWAP_V3: 0.05, // 0.05%, 0.30%, and 1% (pooltól függően)
  SEAPORT: 0,
  LOOKS_RARE: 2,
  NFTX: 5, // 5% Minting Fee , 0% Random Redemption Fee, 5% Targeted Redemption Fee
  CRYPTOPUNKS: 0,
  X2Y2: 0.5,
  SUDOSWAP: 0.5,
  NFT20: 5,
  FOUNDATION: 0, // up to 15% a ToS alapján (de ahogy nézem opcionális, párat megnéztem és ott nem láttam)
}

export {
  PURCHASABLE_REQUIREMENT_TYPES,
  SUPPORTED_CURRENCIES,
  PROTOCOL_FEES_PERCENTAGE,
}
