type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type Guild = {
  id: number
  name: string
  urlName: string
  requirements: Requirement[]
  members: number
}

type Requirement = {
  holdType: "NFT" | "POAP" | "TOKEN"
  nft?: string
  poap?: string
  token?: string
  tokenQuantity?: number
  customAttribute?: string
}

enum HoldTypeColors {
  NFT = "#4ade80",
  POAP = "#60a5fa",
  TOKEN = "#818CF8",
}

export type { CoingeckoToken, Guild, Requirement }
export { HoldTypeColors }
