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
  | "WHITELIST"

type SupportedChains =
  | "ETHEREUM"
  | "POLYGON"
  | "XDAI"
  | "BSC"
  | "AVALANCHE"
  | "FANTOM"
  | "BSC"

type Requirement = {
  type: RequirementType
  address?: string
  symbol?: string
  method?: string
  key?: string
  value: string | Record<string, string | number> | Array<string> | [number, number] // [number, number] is only needed for easy form handling, we don't store it this way on the backend
  name?: string
  chain: SupportedChains
  interval?: [number, number] // Needed for easy form handling, we don't store it this way on the backend
}

type RequirementFormField = {
  id?: string
  active: boolean
  chain: SupportedChains
  type: RequirementType
  address: string
  key?: any
  value?: any
  interval?: any
}

type Level = {
  id: number
  requirements: Array<Requirement>
  membersCount?: number
  members: Array<string>
  telegramGroupId?: string
  discordRole?: string
  logic?: Logic
}

type PlatformName = "TELEGRAM" | "DISCORD" | "DISCORD_CUSTOM"

type Platform = {
  platformIdentifier: number
  platformType: PlatformName
  platformName: string
  inviteChannel: string
  roles: Role[]
}

type User =
  | {
      id: number
      addresses: number
      telegramId?: boolean
      discordId?: boolean
    }
  | {
      id: number
      addresses: Array<string>
      telegramId?: string
      discordId?: string
    }

type Role = {
  id: number
  name: string
  description?: string
  imageUrl?: string
  owner?: User
  requirements: Array<Requirement>
  members: Array<string>
  logic?: Logic
}

type GuildBase = {
  name: string
  urlName: string
  imageUrl: string
  roles: Array<string>
  memberCount: number
}

type Guild = {
  id: number
  name: string
  urlName: string
  imageUrl: string
  description?: string
  platforms: Platform[]
  owner?: User
  theme?: Theme
  members: Array<string>
}

enum RequirementTypeColors {
  ERC721 = "var(--chakra-colors-green-400)",
  POAP = "var(--chakra-colors-blue-400)",
  MIRROR = "var(--chakra-colors-gray-300)",
  ERC20 = "var(--chakra-colors-indigo-400)",
  COIN = "var(--chakra-colors-indigo-400)",
  SNAPSHOT = "var(--chakra-colors-orange-400)",
  WHITELIST = "var(--chakra-colors-gray-200)",
  UNLOCK = "var(--chakra-colors-salmon-400)",
  JUICEBOX = "var(--chakra-colors-yellow-500)",
  ERC1155 = "var(--chakra-colors-teal-400)",
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
  Level,
  Platform,
  GuildBase,
  Guild,
  Requirement,
  RequirementType,
  SupportedChains,
  SnapshotStrategy,
  ThemeMode,
  RequirementFormField,
  SelectOption,
}
export { RequirementTypeColors }
