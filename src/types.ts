import { EventData, State } from "xstate"
type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type DiscordError = { error: string; errorDescription: string }

type WalletError = { code: number; message: string }

type Machine<Context> = [
  State<Context>,
  (event: string, payload?: EventData) => State<Context>
]
type Rest = {
  [x: string]: any
}

type Logic = "AND" | "OR" | "NOR" | "NAND"

type ThemeMode = "LIGHT" | "DARK"

type Theme = {
  color?: string
  mode?: ThemeMode
  backgroundImage?: string
  backgroundCss?: string
}

type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type Poap = {
  id: number
  fancy_id: string
  name: string
  event_url?: string
  image_url: string
  country?: string
  city?: string
  description?: string
  year: number
  start_date: string
  end_date: string
  expiry_date: string
  from_admin: boolean
  virtual_event: boolean
  event_template_id: number
  event_host_id: number
}

type NFT = {
  name: string
  type: string
  address: string
  logoUri: string
  slug: string
}

type RequirementType =
  | "COIN"
  | "ERC20"
  | "ERC721"
  | "ERC1155"
  | "POAP"
  | "MIRROR"
  | "UNLOCK"
  | "SNAPSHOT"
  | "JUICEBOX"
  | "ALLOWLIST"
  | "FREE"

type SupportedChains =
  | "ETHEREUM"
  | "POLYGON"
  | "GNOSIS"
  | "BSC"
  | "AVALANCHE"
  | "FANTOM"
  | "BSC"
  | "OPTIMISM"
  | "MOONRIVER"

type Requirement = {
  // Basic props
  type: RequirementType
  chain: SupportedChains
  address?: string
  data?: {
    hideAllowlist?: boolean
    amount?: number // Amount or minimum amount staked (JUICEBOX)
    addresses?: Array<string> // (ALLOWLIST)
    id?: string // fancy_id (POAP), edition id (MIRROR), id of the project (JUICEBOX)
    strategy?: {
      name: string
      params: Record<string, any>
    } // SNAPSHOT
    attribute?: {
      trait_type?: string
      value?: string
      interval?: {
        min: number
        max: number
      }
    }
  }
  // Props used inside the forms on the UI
  id?: string
  active?: boolean
  nftRequirementType?: string
  // These props are only used when we fetch requirements from the backend and display them on the UI
  roleId?: number
  symbol?: string
  name?: string
  decimals?: number
}

type NftRequirementType = "AMOUNT" | "ATTRIBUTE" | "CUSTOM_ID"

type GuildFormType = {
  chainName?: SupportedChains
  name?: string
  urlName?: string
  imageUrl?: string
  customImage?: string
  description?: string
  logic: Logic
  requirements: Array<Requirement>
  platform?: PlatformName
  discord_invite?: string
  channelId?: string
  DISCORD?: {
    platformId?: string
  }
  TELEGRAM?: { platformId?: string }
}

type PlatformName = "TELEGRAM" | "DISCORD" | ""

type Platform = {
  id: number
  type: PlatformName
  platformName: string
  platformId: string
}

type User =
  | {
      id: number
      addresses: number
      telegramId?: boolean
      discordId?: boolean
      discord?: null
      telegram?: null
    }
  | {
      id: number
      addresses: Array<string>
      telegramId?: string
      discordId?: string
      discord?: {
        username: string
        avatar: string
      }
      telegram?: {
        username: string
        avatar: string
      }
    }

type Role = {
  id: number
  name: string
  description?: string
  imageUrl?: string
  owner?: User
  requirements: Array<Requirement>
  members?: Array<string>
  memberCount: number
  logic?: Logic
}

type GuildBase = {
  name: string
  urlName: string
  imageUrl: string
  roles: Array<string>
  memberCount: number
}

type GuildAdmin = {
  id: number
  address: string
  isOwner: boolean
}

type Guild = {
  id: number
  name: string
  urlName: string
  imageUrl: string
  description?: string
  platforms: Platform[]
  theme?: Theme
  members: Array<string>
  showMembers?: boolean
  admins?: GuildAdmin[]
  roles: Array<Role>
}

enum RequirementTypeColors {
  ERC721 = "var(--chakra-colors-green-400)",
  ERC1155 = "var(--chakra-colors-green-400)",
  POAP = "var(--chakra-colors-blue-400)",
  MIRROR = "var(--chakra-colors-gray-300)",
  ERC20 = "var(--chakra-colors-indigo-400)",
  COIN = "var(--chakra-colors-indigo-400)",
  SNAPSHOT = "var(--chakra-colors-orange-400)",
  ALLOWLIST = "var(--chakra-colors-gray-200)",
  UNLOCK = "var(--chakra-colors-salmon-400)",
  JUICEBOX = "var(--chakra-colors-yellow-500)",
  FREE = "var(--chakra-colors-cyan-400)",
}

type SnapshotStrategy = {
  name: string
  params: Record<string, Record<string, string>>
}

type SelectOption = {
  label: string
  value: string
  img?: string
} & Rest

export type {
  GuildAdmin,
  Token,
  DiscordError,
  WalletError,
  Machine,
  Rest,
  CoingeckoToken,
  Poap,
  User,
  NFT,
  PlatformName,
  Role,
  Platform,
  GuildBase,
  Guild,
  Requirement,
  RequirementType,
  SupportedChains,
  SnapshotStrategy,
  ThemeMode,
  Logic,
  SelectOption,
  NftRequirementType,
  GuildFormType,
}
export { RequirementTypeColors }
