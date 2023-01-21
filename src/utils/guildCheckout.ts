import { RequirementType } from "requirements"

const PURCHASABLE_REQUIREMENT_TYPES: RequirementType[] = [
  "ERC20",
  "ERC721",
  "ERC1155",
]

const SUPPORTED_CURRENCIES: { chainId: number; address?: string }[] = [
  // ETH
  {
    chainId: 1,
  },
  // OWO
  {
    chainId: 5,
    address: "0x3C65D35A8190294d39013287B246117eBf6615Bd",
  },
  // MATIC
  {
    chainId: 137,
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
